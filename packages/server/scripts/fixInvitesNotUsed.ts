import { Log } from '../libs/logger'
import { getRedis } from '../libs/redis'

const logger = Log({ service: 'script:fixInvitesNotUsed' })

async function Main() {
  const redis = await getRedis()
  const invitesCodes = await redis.scan(
    0,
    'MATCH',
    'invite:code:*',
    'COUNT',
    10000
  )
  const stats = {
    invitedMinter: 0,
    invitedNotMinter: 0,
  }

  for (let i = 0; i < invitesCodes[1].length; i++) {
    const inviteCode = await redis.hgetall(invitesCodes[1][i])
    if (inviteCode.to) {
      const toMinter = await redis.hgetall(`invite:addr:${inviteCode.to}`)
      if (Object.keys(toMinter).length === 0) {
        // const fromMinter = await redis.hgetall(`invite:addr:${inviteCode.from}`)
        stats.invitedNotMinter++
        await redis
          .multi([
            ['hdel', invitesCodes[1][i], 'to'],
            ['hdel', invitesCodes[1][i], 'time:use'],
            [
              'hdel',
              `invite:addr:${inviteCode.from}`,
              `${inviteCode.index}:used`,
            ],
          ])
          .exec()
        logger.info('Invited but not minter', inviteCode.to)
      } else {
        stats.invitedMinter++
        logger.info('To minter', inviteCode.to)
      }
    }
  }

  logger.info('stats', stats)

  redis.disconnect(false)
}

Main().catch((error) => logger.error('fixInvitesNotUsed main error', error))
