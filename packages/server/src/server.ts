import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import winston from 'winston'

import { loggerApi } from './logger'
import { config } from './config'
import { router } from './router'

async function Server() {
  const app = new Koa()

  app.use(helmet())
  app.use(cors())
  app.use(loggerApi(winston))
  app.use(bodyParser())
  app.use(router.routes()).use(router.allowedMethods())
  app.listen(config.port)
  console.log(`Server running on port ${config.port}`)
}

Server().catch((error: string) => console.log('Starting error: ', error))
