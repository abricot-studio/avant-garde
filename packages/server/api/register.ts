import { VercelRequest, VercelResponse } from '@vercel/node'
import { getAddress, verifyMessage } from 'ethers/lib/utils'
import Redis from 'ioredis'
import { config } from '../libs/config'
import { Log } from '../libs/logger'
import { Middlewares } from '../libs/middlewares'
import { getRedis } from '../libs/redis'

const logger = Log({ service: 'register' })

let redis: Redis.Redis = null

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> => {
  if (!Middlewares(req, res)) return

  let address = null

  try {
    address = getAddress(req.body.address)
  } catch (error) {
    logger.error('Address invalid', {
      address,
      error,
    })

    return res.status(400).json({
      status: 'error',
      message: 'address is not valid',
    })
  }

  if (address !== verifyMessage(config.authMessage, req.body.token)) {
    return res.status(400).json({
      status: 'error',
      message: 'token invalid',
    })
  }

  if (!redis) {
    redis = await getRedis()
  }

  const redisAdd: any = await redis.zadd('register', 'NX', Date.now(), address)

  if (redisAdd === 1) {
    return res.status(200).json({
      status: 'success',
      message: 'address register',
    })
  } else {
    return res.status(200).json({
      status: 'success',
      message: 'address already register',
    })
  }
}
