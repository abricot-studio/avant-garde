import { Context } from 'koa';

import { config } from '../config';
import { Model } from '../image/model';
import { Render } from '../image/render';
import pinata from '../pinata';

export class Main {

  private static processing: string[] = [];

  private static async genNew(address: string): Promise<string> {

    const seed = parseInt(address, 16) / 1000000000000000000000;
    const inputShape = [config.image.width, config.image.height];

    const model = new Model(
      inputShape,
      config.image.blackWhite,
      config.image.scale,
      config.image.batchSize,
      32,
      8,
      seed,
    );
    const render = new Render(config.image.height, config.image.width, config.image.blackWhite, config.image.outputsDir);
    const dataImg = model.generate();
    const path = await render.draw(dataImg, address);
    const ipfsHash = await pinata.upload(path, address);
    await render.viewer.rm(address);

    return ipfsHash;

  }

  public static async gen(ctx: Context): Promise<void> {

    const address = ctx.request.body.address;

    const existIpfsHash = await pinata.find(address);

    if(existIpfsHash){

      ctx.body = {
        status: 'success',
        ipfsHash: existIpfsHash
      };

    } else if(Main.processing.find(processing => processing === address) ){

      ctx.body = {
        status: 'processing',
        ipfsHash: null
      };

    } else {

      Main.processing.push(address);

      await Main.genNew(address).then( (ipfsHash) => {

        Main.processing = Main.processing.filter(processing => processing !== address);

        ctx.body = {
          status: 'success',
          ipfsHash
        };

      }).catch( (error) => {

        ctx.body = {
          status: error,
          ipfsHash: null
        };

      });

    }

  }

}
