import * as dotenv from 'dotenv'
import * as Fs from 'fs'
import { Log } from '../libs/logger'
import { getRedis } from '../libs/redis'
dotenv.config()

const logger = Log({ service: 'script:getRegisters' })

interface Register {
  address: string
  date: string
}
async function Main() {
  const redis = await getRedis()
  const streamRegister = redis.zscanStream('register')
  const registers: Register[] = []
  streamRegister.on('data', (resultKeys: any) => {
    for (let i = 0; i < resultKeys.length; i = i + 2) {
      registers.push({
        address: resultKeys[i],
        date: new Date(parseInt(resultKeys[i + 1])).toISOString(),
      })
    }
  })

  return new Promise((resolve) =>
    streamRegister.on('end', () => {
      logger.info('registers', { registers })
      const path = `./backup/${new Date(
        new Date().toUTCString()
      ).toISOString()}_register.json`
      Fs.writeFileSync(path, JSON.stringify(registers, null, 2))

      redis.disconnect(false)
      resolve(true)
    })
  )
}

Main().catch((error) => logger.error('getRegisters main error', error))
