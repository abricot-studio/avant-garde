import { Context } from 'koa';
import { upload } from '../pinata';
import { config } from '../config';
import { Model } from '../image/model';
import { Render } from '../image/render';

export class Main {

  public static async gen(ctx: Context): Promise<void> {

    const address = ctx.request.body.address;
    const seed = parseInt(address, 16) / 1000000000000000000000 + Date.now();
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
    const ipfsHash = await upload(path, address);
    await render.viewer.rm(address);

    ctx.body = {
      status: 'success',
      ipfsHash
    };

  }

}
