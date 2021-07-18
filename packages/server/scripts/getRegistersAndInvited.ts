import * as Fs from 'fs'
import { Log } from '../libs/logger'
import { getRedis } from '../libs/redis'

const logger = Log({ service: 'script:getRegistersAndInvited.ts' })

interface Register {
  address: string
  date: string
}

interface Invited {
  address: string
  date: string
}

async function getRegister() {
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

  logger.info('registers', { registers, count: registers.length })
  return registers
}

async function getInvited() {
  const redis = await getRedis()
  const redisInvited = await redis.zrangebyscore(
    'invited',
    '1',
    '+inf',
    'WITHSCORES'
  )
  const invited: Invited[] = []
  for (let i = 0; i < redisInvited.length; i = i + 2) {
    invited.push({
      address: redisInvited[i],
      date: new Date(parseFloat(redisInvited[i + 1])).toISOString(),
    })
  }

  logger.info('invited', { invited, count: invited.length })
  return invited
}

async function Main() {
  const redis = await getRedis()

  const registers = await getRegister()
  const invited = await getRegister()

  const path = `./backup/${new Date(
    new Date().toUTCString()
  ).toISOString()}_register_and_invited.json`
  Fs.writeFileSync(path, JSON.stringify({ registers, invited }, null, 2))

  redis.disconnect(false)
}

Main().catch((error) =>
  logger.error('getRegistersAndInvited main error', error)
)
