import type { NextApiRequest, NextApiResponse } from "next";
import pinata from "../../pinata";
import {Log} from "../../logger";
import {Render} from "../../image/render";
import generate from "../../image/generate";
import { config } from '../../config';

const logger = Log({ service: 'generation' })
import loadTf from 'tfjs-node-lambda';
import axios from "axios";


let tf: typeof import('@tensorflow/tfjs') = null;

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const address = req.body.address;
  // const resGet = await dynamoDb.get({
  //   TableName: process.env.QUEUE_TABLE,
  //   Key: { address }
  // }).promise();

  if(Object.keys({}).length === 0){

    const existIpfsHash = await pinata.find(address);

    if(existIpfsHash){

      logger.info('existIpfsHash', { existIpfsHash });
      res.status(200).json({
        status: 'success',
        ipfsHash: existIpfsHash
      });

    } else {

      // const file = createReadStream(join('.', '_files', 'nodejs12.x-tf3.3.0.br'), 'utf8');
      // const tf: typeof import('@tensorflow/tfjs') = await loadTf(file);
      // const ready = await prepareTf.next();
      if(!tf || !tf.sequential){

        const response = await axios.get(
          'https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.4/nodejs12.x-tf3.3.0.br',
          { responseType: 'stream' },
        );

        tf = await loadTf(response.data);
        // return res.status(200).json({
        //   status: 'loading',
        //   ipfsHash: null
        // });

      }

      logger.info('start processing', { address });

      // await dynamoDb.put({
      //   TableName: process.env.QUEUE_TABLE,
      //   Item: {
      //     address,
      //     status: 'processing',
      //     expires: parseInt( (Date.now() / 1000 + 15 * 60).toString(), 10) // now + 15 min
      //   }
      // }).promise();

      const render = new Render(config.image.height, config.image.width, config.image.blackWhite, config.image.outputsDir);
      const path = await generate(address, render, tf);
      const ipfsHash = await pinata.upload(path, address);
      await render.viewer.rm(address);

      // await dynamoDb.delete({
      //   TableName: process.env.QUEUE_TABLE,
      //   Key: { address }
      // }).promise();

      logger.info('end processing', { address, ipfsHash });

      res.status(200).json({
        status: 'success',
        ipfsHash: ipfsHash
      });
    }

  } else {

    logger.info('processing', { address });

    // return formatJSONResponse({
    //   status: 'processing',
    //   ipfsHash: null
    // });

  }

};
