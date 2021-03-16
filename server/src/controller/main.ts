import { BaseContext } from 'koa';

export class Main {

  public static async gen(ctx: BaseContext): Promise<void> {
    ctx.body = 'Hello World!';
  }

}
