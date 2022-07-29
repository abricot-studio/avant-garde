import { VercelRequest, VercelResponse } from '@vercel/node'
import { getAddress, verifyMessage } from 'ethers/lib/utils'
import Redis from 'ioredis'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../libs/config'
import { getTokenById } from '../libs/graphql'
import { Log } from '../libs/logger'
import { Middlewares } from '../libs/middlewares'
import { getRedis } from '../libs/redis'

const logger = Log({ service: 'invite' })

let redis: Redis = null

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> => {
  if (!Middlewares(req, res)) return

  if (!config.inviteMode) {
    logger.error('Invite disabled')

    return res.status(400).json({
      status: 'error',
      message: 'Invite disabled',
    })
  }

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

  if (!token || address !== verifyMessage(config.authMessage, token)) {
    logger.error('token invalid', {
      address,
    })
    return res.status(400).json({
      status: 'error',
      message: 'token invalid',
    })
  }

  if (!redis) {
    redis = await getRedis()
  }

  const redisExisting = await redis.hgetall(`invite:addr:${address}`)

  if (Object.keys(redisExisting).length !== 0) {
    return res.status(200).json({
      status: 'success',
      inviteCodes: Object.keys(redisExisting)
        .filter((key) => !key.includes(':') && key !== 'time')
        .map((key) => ({
          code: redisExisting[key],
          used: !!redisExisting[`${key}:used`],
        })),
    })
  }

  const [isRegister, isInvited] = await Promise.all([
    redis.zscore('register', address),
    redis.zscore('invited', address),
  ])
  if (!isRegister && !isInvited) {
    logger.error('Not invited yet', {
      address,
    })
    return res.status(400).json({
      status: 'error',
      message: 'Not invited yet',
    })
  }
  const existingToken = await getTokenById(address)
  if (!existingToken) {
    logger.error('Not minted yet', {
      address,
    })
    return res.status(400).json({
      status: 'error',
      message: 'Not minted yet',
    })
  }
  const inviteCodes = [uuidv4(), uuidv4(), uuidv4()]
  const now = Date.now()
  const resHSetNx = await redis.hsetnx(`invite:addr:${address}`, 'time', now)

  if (resHSetNx !== 1) {
    logger.error('processing', {
      address,
    })
    return res.status(400).json({
      status: 'error',
      message: 'processing',
    })
  }

  await redis
    .multi([
      [
        'hmset',
        `invite:addr:${address}`,
        '0',
        inviteCodes[0],
        '1',
        inviteCodes[1],
        '2',
        inviteCodes[2],
      ],
      ...inviteCodes.map((inviteCode, i) => [
        'hmset',
        `invite:code:${inviteCode}`,
        'time:create',
        now,
        'from',
        address,
        'index',
        i,
      ]),
    ])
    .exec()

  return res.status(200).json({
    status: 'success',
    inviteCodes: inviteCodes.map((inviteCode) => ({
      code: inviteCode,
      used: false,
    })),
  })
}
