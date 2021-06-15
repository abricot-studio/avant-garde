import * as Fs from 'fs'
import { Log } from '../../libs/logger'
import { getRedis } from '../../libs/redis'

const logger = Log({ service: 'script:migration:registerTimestamp' })

async function Main() {
  const redis = await getRedis()
  const streamRegister = redis.sscanStream('register')
  const registers: string[] = []
  streamRegister.on('data', (resultKeys: any) => {
    registers.push(...resultKeys)
  })

  return new Promise((resolve) =>
    streamRegister.on('end', async () => {
      logger.info('registers', { registers })
      const path = `./backup/${new Date(
        new Date().toUTCString()
      ).toISOString()}_register.json`
      Fs.writeFileSync(path, JSON.stringify(registers, null, 2))

      const redisDel = await redis.del('register')
      logger.info('del key', { redisDel })

      const date = Date.now()
      for (const address of registers) {
        const redisAdd: any = await redis.zadd('register', 'NX', date, address)
        logger.info('Migrating address', { redisAdd, address })
      }

      logger.info('Migrate Done', {})

      redis.disconnect(false)
      resolve(true)
    })
  )
}

Main().catch((error) => logger.error('getRegisters main error', error))
