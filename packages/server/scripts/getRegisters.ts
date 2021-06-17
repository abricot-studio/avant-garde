import * as Fs from 'fs'
import { Log } from '../libs/logger'
import { getRedis } from '../libs/redis'

const logger = Log({ service: 'script:getRegisters' })

interface Register {
  address: string
  date: string
}
async function Main() {
  const redis = await getRedis()
  const redisRegister = await redis.zrangebyscore(
    'register',
    '1',
    '+inf',
    'WITHSCORES'
  )
  const registers: Register[] = []
  for (let i = 0; i < redisRegister.length; i = i + 2) {
    registers.push({
      address: redisRegister[i],
      date: new Date(parseFloat(redisRegister[i + 1])).toISOString(),
    })
  }

  logger.info('registers', { registers })
  const path = `./backup/${new Date(
    new Date().toUTCString()
  ).toISOString()}_register.json`
  Fs.writeFileSync(path, JSON.stringify(registers, null, 2))

  redis.disconnect(false)
}

Main().catch((error) => logger.error('getRegisters main error', error))
