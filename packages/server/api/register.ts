import { VercelRequest, VercelResponse } from '@vercel/node'
import { getAddress } from 'ethers/lib/utils'
import { Log } from '../libs/logger'
import { Middlewares } from '../libs/middlewares'
import { getRedis } from '../libs/redis'

const logger = Log({ service: 'register' })

let redis: typeof import('ioredis') = null

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> => {
  if(!Middlewares(req, res)) return

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

  if (!redis) {
    redis = await getRedis()
  }

  const redisAdd = await redis.sadd('register', address)

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
