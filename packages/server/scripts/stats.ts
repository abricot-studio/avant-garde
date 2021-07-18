import { Log } from '../libs/logger'
import { getRedis } from '../libs/redis'

const logger = Log({ service: 'script:stats' })

async function Main() {
  const redis = await getRedis()
  const invitesCodes = await redis.scan(
    0,
    'MATCH',
    'invite:code:*',
    'COUNT',
    10000
  )
  const invitesAddress = await redis.scan(
    0,
    'MATCH',
    'invite:addr:*',
    'COUNT',
    10000
  )
  const registers = await redis.zrangebyscore('register', 1, '+inf')
  const invited = await redis.zrangebyscore('invited', 1, '+inf')
  const stats = {
    countInviteCode: invitesCodes[1].length,
    countMinter: invitesAddress[1].length,
    countMinterFromRegister: registers.filter((register) =>
      invitesAddress[1].find((key) => key === `invite:addr:${register}`)
    ).length,
    countMinterFromInvite: invited.filter((invite) =>
      invitesAddress[1].find((key) => key === `invite:addr:${invite}`)
    ).length,
    countRegisters: registers.length,
    countInvited: invited.length,
  }

  logger.info('stats', stats)

  redis.disconnect(false)
}

Main().catch((error) => logger.error('stats main error', error))
