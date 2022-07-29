import { Wallet } from '@ethersproject/wallet'
import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { getAddress } from 'ethers/lib/utils'
import Redis from 'ioredis'
import { tmpdir } from 'os'
import loadTf from 'tfjs-node-lambda'
import { config } from '../libs/config'
import generate from '../libs/image/generate'
import { Render } from '../libs/image/render'
import { Log } from '../libs/logger'
import { Middlewares } from '../libs/middlewares'
import Pinata from '../libs/pinata'
import { getRedis } from '../libs/redis'
import { signURI } from '../libs/sign'

const logger = Log({ service: 'generation' })
const signer = new Wallet(config.privateKey)

let tf: typeof import('@tensorflow/tfjs') = null
let redis: Redis.Redis = null

async function CheckInvite(
  res: VercelResponse,
  address: string,
  inviteCode: string,
  redis
): Promise<boolean> {
  if (!config.inviteMode) {
    return true
  }

  const [isRegister, isInvited] = await Promise.all([
    redis.zscore('register', address),
    redis.zscore('invited', address),
  ])

  if (isRegister === null && isInvited === null) {
    if (!inviteCode) {
      logger.error('Address is not registry or invited', {
        address,
      })
      res.status(400).json({
        status: 'error',
        message: 'You are not registered or invited yet',
        ipfsHashMetadata: null,
        ipfsHashImage: null,
        signature: null,
      })
      return false
    }

    const redisExisting = await redis.hgetall(`invite:code:${inviteCode}`)

    if (Object.keys(redisExisting).length === 0 || redisExisting['time:use']) {
      logger.error('Code invalid or expired', {
        address,
      })
      res.status(400).json({
        status: 'error',
        message: 'Code invalid or expired',
        ipfsHashMetadata: null,
        ipfsHashImage: null,
        signature: null,
      })
      return false
    }
    const now = Date.now()
    const redisHSetNx = await redis.hsetnx(
      `invite:code:${inviteCode}`,
      'time:use',
      now
    )

    if (redisHSetNx !== 1) {
      logger.error('Processing code', {
        address,
      })
      res.status(400).json({
        status: 'error',
        message: 'Processing code',
        ipfsHashMetadata: null,
        ipfsHashImage: null,
        signature: null,
      })
      return false
    }

    await redis
      .multi([
        ['hsetnx', `invite:code:${inviteCode}`, 'to', address],
        [
          'hsetnx',
          `invite:addr:${redisExisting.from}`,
          `${redisExisting.index}:used`,
          address,
        ],
        ['zadd', 'invited', 'NX', now, address],
      ])
      .exec()
    return true
  }
}

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> => {
  if (!Middlewares(req, res)) return

  let address = null
  const inviteCode =
    req.body.inviteCode &&
    req.body.inviteCode.length === 36 &&
    req.body.inviteCode

  if (!config.generate) {
    logger.error('not started yet', {
      address,
    })

    return res.status(400).json({
      status: 'error',
      message: 'Not started yet',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
    })
  }

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
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
    })
  }

  if (!redis) {
    redis = await getRedis()
  }
  if (!(await CheckInvite(res, address, inviteCode, redis))) return

  const redisExisting = await redis.get(`generate:${address}`)

  if (redisExisting) {
    if (redisExisting === 'processing') {
      logger.info('processing', { address })
      return res.status(200).json({
        status: 'processing',
        ipfsHashMetadata: null,
        ipfsHashImage: null,
        signature: null,
      })
    } else if (redisExisting.split(':').length === 3) {
      const [ipfsHashMetadata, ipfsHashImage, signature] =
        redisExisting.split(':')
      logger.info('existIpfsHash in redis', {
        address,
        ipfsHashMetadata,
        ipfsHashImage,
      })
      return res.status(200).json({
        status: 'success',
        ipfsHashMetadata,
        ipfsHashImage,
        signature,
      })
    } else {
      logger.error('redis data incorrect', {
        address,
        redisExisting,
      })
      throw new Error('redis data incorrect')
    }
  }

  const existIpfsHash = await Pinata.find(address)

  if (existIpfsHash) {
    logger.info('existIpfsHash in pinata', {
      address,
      ipfsHashMetadata: existIpfsHash.ipfsHashMetadata,
      ipfsHashImage: existIpfsHash.ipfsHashImage,
    })
    const signature = await signURI(
      existIpfsHash.ipfsHashMetadata,
      address,
      signer
    )
    await redis.set(
      `generate:${address}`,
      `${existIpfsHash.ipfsHashMetadata}:${existIpfsHash.ipfsHashImage}:${signature}`,
      'EX',
      config.redis.expirationData
    )

    return res.status(200).json({
      status: 'success',
      ipfsHashMetadata: existIpfsHash.ipfsHashMetadata,
      ipfsHashImage: existIpfsHash.ipfsHashImage,
      signature,
    })
  }

  if (!tf || !tf.sequential) {
    logger.info('fetch tf', { address })
    const response = await axios.get(
      'https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.4/nodejs12.x-tf3.3.0.br',
      { responseType: 'stream' }
    )
    tf = await loadTf(response.data)
    logger.info('loaded tf', { address })
    return res.status(200).json({
      status: 'processing',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
      signerAddress: signer.address,
    })
  }

  const resSetNx = await redis.set(
    `generate:${address}`,
    'processing',
    'NX',
    'EX',
    config.redis.expirationProcessing
  )

  if (resSetNx !== 'OK') {
    logger.info('processing', { address })
    return res.status(200).json({
      status: 'processing',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
      signerAddress: signer.address,
    })
  }

  const startTime = Date.now()
  logger.info('start processing', { address })

  const render = new Render(
    config.image.height,
    config.image.width,
    config.image.blackWhite,
    tmpdir()
  )
  const path = await generate(address, render, tf)
  const ipfsHashImage = await Pinata.uploadImage(path, address)
  const ipfsHashMetadata = await Pinata.uploadMetadata(ipfsHashImage, address)
  await render.viewer.rm(address)

  logger.info('end processing', {
    address,
    ipfsHashMetadata,
    ipfsHashImage,
    time: Date.now() - startTime,
  })

  const signature = await signURI(ipfsHashMetadata, address, signer)
  await redis.set(
    `generate:${address}`,
    `${ipfsHashMetadata}:${ipfsHashImage}:${signature}`,
    'EX',
    config.redis.expirationData
  )

  res.status(200).json({
    status: 'success',
    ipfsHashMetadata,
    ipfsHashImage,
    signature,
  })
}
