import Redis from 'ioredis'
import { config } from './config'

const redis = new Redis(config.redis.url, {
  retryStrategy(times) {
    return Math.min(times * 50, 2000)
  },
})

export async function getRedis(): Promise<Redis> {
  return redis
}

export default { getRedis }
