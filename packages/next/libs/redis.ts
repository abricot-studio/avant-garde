import Redis from 'ioredis'
import { config } from '@libs/config'

const redis = new Redis(config.redis.host, {
  retryStrategy(times) {
    return Math.min(times * 50, 2000)
  },
})

export async function getRedis() {
  return redis
}

export default { getRedis }
