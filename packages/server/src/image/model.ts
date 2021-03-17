import * as tf from '@tensorflow/tfjs-node';

import { Logger } from '../logger';

const logger = Logger({ service: 'Model' });

export class Model {

  inputShape: any;
  blackWhite: boolean;
  scale: number;
  batchSize: number;
  units: number;
  depth: number;
  numFeatures: number;
  model: tf.Sequential;
  useBias: boolean;
  seed?: number;

  constructor(
    inputShape: any,
    blackWhite = false,
    scale = 100,
    batchSize = 1000,
    units = 32,
    depth = 8,
    seed?: number
  ) {

    this.inputShape = inputShape;
    this.blackWhite = blackWhite;
    this.scale = scale;
    this.batchSize = batchSize;
    this.units = units;
    this.depth = depth;
    this.seed = seed;

    this.numFeatures = 3;
    this.useBias = false;
    this.model = this.buildModel();
    // this.model.summary();

  }

  buildModel(){

    const model = tf.sequential();

    const initializer = tf.initializers.varianceScaling({
      seed: this.seed,
      scale: this.scale,
      mode: 'fanIn',
      distribution: 'normal'
    });

    model.add(tf.layers.dense({
      inputShape: [this.numFeatures],
      units: this.units,
      kernelInitializer: initializer,
      biasInitializer: initializer,
      useBias: this.useBias,
      activation: 'tanh',
    }));

    // model.add(tf.layers.conv2d({
    //   inputShape: [this.inputShape[1], this.inputShape[0], this.numFeatures],
    //   kernelSize: 3,
    //   filters: this.numFeatures * 4,
    //   strides: 1,
    //   useBias: this.useBias,
    //   biasInitializer: initializer,
    //   kernelInitializer: initializer,
    //   padding: 'same',
    //   activation: 'tanh'
    // }));
    // model.add(tf.layers.maxPooling2d({
    //   padding: 'same',
    //   poolSize: this.numFeatures,
    //   strides: this.numFeatures
    // }));

    for(let i = 0; i < this.depth; i++){

      model.add(tf.layers.dense({
        units: this.units,
        kernelInitializer: initializer,
        biasInitializer: initializer,
        useBias: this.useBias,
        activation: 'tanh',
      }));
      // model.add(tf.layers.conv2d({
      //   kernelSize: 2,
      //   filters: this.numFeatures * 4,
      //   strides: 1,
      //   kernelInitializer: initializer,
      //   padding: 'same',
      //   activation: 'tanh'
      // }));
    }
    // model.add(tf.layers.flatten());

    model.add(tf.layers.dense({
      units: (this.blackWhite ? 1 : 3),
      // kernelInitializer: initializer,
      kernelInitializer: tf.initializers.glorotNormal({ seed: this.seed }),
      useBias: this.useBias,
      biasInitializer: initializer,
      // activation: 'tanh',
      // activation: null,
      activation: 'sigmoid',
    }));

    model.compile({
      loss: 'meanSquaredError',
      optimizer: 'rmsprop',
      metrics: ['accuracy']
    });

    return model;

  }

  generate(){

    const features = [];

    for(let i = 0; i < this.inputShape[1]; i++){

      // const line = [];

      for(let j = 0; j < this.inputShape[0]; j++){

        const a = i * this.seed;
        const b = j * this.seed;

        features.push(
          Math.pow(i - this.inputShape[1], 1)
          , Math.pow(j - this.inputShape[0], 1)
          , Math.sqrt(a * a + b * b)
        );

      }

      // features.push(line);

    }

    const input = tf.tensor2d(features, [this.inputShape[1] * this.inputShape[0], this.numFeatures]);
    // const input = tf.tensor3d(features, [this.inputShape[1], this.inputShape[0], this.numFeatures]);

    logger.profile('compute', { level: 'verbose', message: 'start compute' });

    const output = tf.tidy(() => {

      return this.miniBatch(Model.normalizeTensor(input) );
      // const output = this.model.predict(Model.normalizeTensor(input)
      // .reshape([-1, this.inputShape[1], this.inputShape[0], this.numFeatures])
      // );

    });

    logger.profile('compute', { level: 'verbose', message: 'end compute' });

    const regularize: any = Model.regularizeTensor(output);
    tf.dispose([input, regularize]);

    return regularize;

  }

  miniBatch(features: any){

    let arePending = true;
    let i = 0;
    let outputs: any[] = [];

    const totalBach = Math.round(features.shape[0] / this.batchSize);
    logger.verbose(`Total batch: ${totalBach}`);

    while (arePending){

      let batchFeatures: any[] = [];

      if(i * this.batchSize + this.batchSize >= features.shape[0]){

        arePending = false;
        batchFeatures = batchFeatures.concat(features.slice(i * this.batchSize, features.shape[0] - i * this.batchSize));

      } else {

        batchFeatures = batchFeatures.concat(features.slice(i * this.batchSize, this.batchSize));

      }

      const used = process.memoryUsage();

      logger.debug(`Used: ${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`);

      logger.verbose(`Compute ${i + 1}/${totalBach} batch`);
      logger.profile('compute_one', { level: 'verbose', message: 'start compute one' });

      outputs.push(this.model.predict(batchFeatures) );

      logger.profile('compute_one', { level: 'verbose', message: 'end compute one' });

      i++;

    }

    return tf.concat(outputs);

  }

  static aRange(tensor: any, min: number, max: number){

    const minVal = tensor.min().dataSync()[0];
    const maxVal = tensor.max().dataSync()[0];

    const scale = (max - min) / (maxVal - minVal);

    return Array.from(tensor.dataSync().map( (val: any) => parseInt( ( (val + (min - minVal) ) * scale).toString(), 10) ) );

  }

  static regularizeTensor(data: any){

    // return data.dataSync().map(d => parseInt( (d+ 1) * 255 / 2) );
    // return data.dataSync().map(d => parseInt( (d) * 255) );
    const regularize = Model.aRange(data, 0, 255);
    // console.log(data.min().dataSync(), data.max().dataSync());
    // const regularize = data.dataSync().map(val => (val + 2) * (255 / 4));

    return regularize;

  }

  static determineMeanAndStddev(data: any) {
    const dataMean = data.mean(0);
    const diffFromMean = data.sub(dataMean);
    const squaredDiffFromMean = diffFromMean.square();
    const variance = squaredDiffFromMean.mean(0);
    const dataStd = variance.sqrt();
    return {dataMean, dataStd};
  }


  static normalizeTensor(data: any) {
    const { dataMean, dataStd } = Model.determineMeanAndStddev(data);
    return data.sub(dataMean).div(dataStd);
  }

}

