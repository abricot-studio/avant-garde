import { Viewer } from './viewer';

export class Render {

  height: number;
  width: number;
  blackWhite: boolean;
  viewer: Viewer;
  outputsDir: string;

  constructor(height: number, width: number, blackWhite: boolean, outputsDir: string) {

    this.height = height;
    this.width = width;
    this.blackWhite = blackWhite;
    this.outputsDir = outputsDir;
    this.viewer = new Viewer(this.height, this.width, this.outputsDir);

  }

  drawRandom(){

    const data = [];

    for (let i = 0; i < this.width * this.height * 4; i += 4) {

      if(this.blackWhite){

        const random = Render._randomInt(0, 255);
        data.push(
          random, // red
          random, // green
          random, // blue
          // 255 // alpha
        );

      } else {

        data.push(
          Render._randomInt(0, 255), // red
          Render._randomInt(0, 255), // green
          Render._randomInt(0, 255), // blue
          // 255 // alpha
        );

      }

    }

    return data;

  }

  async draw(rgbData: any, id?: any): Promise<string>{

    const data = [];

    if(this.blackWhite){

      for (let i = 0; i < rgbData.length; i ++) {
        data.push(
          rgbData[i], // red
          rgbData[i], // green
          rgbData[i], // blue
          255 // alpha
        );

      }

    } else {

      for (let i = 0; i < rgbData.length; i += 3) {
        data.push(
          rgbData[i], // red
          rgbData[i + 1], // green
          rgbData[i + 2], // blue
          255 // alpha
        );

      }

    }


    return this.viewer.draw(data, id);

  }

  static _randomInt(min: number, max: number): number {

    return Math.floor(Math.random() * (max - min + 1)) + min;

  }

}
