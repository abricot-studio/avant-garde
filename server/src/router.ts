import Router from '@koa/router';
import { Main } from './controller/main';

const router = new Router();

router.get('/gen', Main.gen);

export { router };
