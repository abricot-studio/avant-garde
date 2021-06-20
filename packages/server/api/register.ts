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
  const token =
    req.body.token && req.body.token.length === 132 && req.body.token

  try {
    address = getAddress(req.body.address)
  } catch (error) {
    logger.error('Address invalid', {
      address,
      error,
    })

    return res.status(400).json({
      status: 'error',
      message: 'Address is not valid',
    })
  }

  if (
    config.registerAuth &&
    (!token || address !== verifyMessage(config.authMessage, token))
  ) {
    logger.error('Token invalid', {
      address,
    })
    return res.status(400).json({
      status: 'error',
      message: 'Token invalid',
    })
  }

  if (!redis) {
    redis = await getRedis()
  }

  const redisZAdd: any = await redis.zadd('register', 'NX', Date.now(), address)

  if (redisZAdd === 1) {
    return res.status(200).json({
      status: 'success',
      message: 'Address register',
    })
  } else {
    return res.status(200).json({
      status: 'success',
      message: 'Address already register',
    })
  }
}
