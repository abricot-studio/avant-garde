import { Wallet } from '@ethersproject/wallet'
import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { getAddress } from 'ethers/lib/utils'
import { tmpdir } from 'os'
import loadTf from 'tfjs-node-lambda'
import { config } from '../libs/config'
import generate from '../libs/image/generate'
import { Render } from '../libs/image/render'
import { Log } from '../libs/logger'
import Pinata from '../libs/pinata'
import { getRedis } from '../libs/redis'
import { signURI } from '../libs/sign'

const logger = Log({ service: 'generation' })
const signer = new Wallet(config.privateKey)

let tf: typeof import('@tensorflow/tfjs') = null
let redis: typeof import('ioredis') = null

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

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
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
      signerAddress: signer.address,
    })
  }

  if (!redis) {
    redis = await getRedis()

    // const keys = await redis.keys('*')
    // await Promise.all(keys.map(key => redis.del(key) ) )
  }

  const redisExisting = await redis.get(address)

  if (redisExisting) {
    if (redisExisting === 'processing') {
      logger.info('processing', { address })
      return res.status(200).json({
        status: 'processing',
        ipfsHashMetadata: null,
        ipfsHashImage: null,
        signature: null,
        signerAddress: signer.address,
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
        signerAddress: signer.address,
      })
    } else {
      logger.error('redis data incorrect', {
        address,
        redisExisting,
      })
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
      address,
      `${existIpfsHash.ipfsHashMetadata}:${existIpfsHash.ipfsHashImage}:${signature}`,
      'EX',
      config.redis.expirationData
    )

    return res.status(200).json({
      status: 'success',
      ipfsHashMetadata: existIpfsHash.ipfsHashMetadata,
      ipfsHashImage: existIpfsHash.ipfsHashImage,
      signature,
      signerAddress: signer.address,
    })
  }

  const resSetNx = await redis.set(
    address,
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

  if (!tf || !tf.sequential) {
    logger.info('fetch tf', { address })
    const response = await axios.get(
      'https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.4/nodejs12.x-tf3.3.0.br',
      { responseType: 'stream' }
    )
    tf = await loadTf(response.data)
    logger.info('loaded tf', { address })
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
    address,
    `${ipfsHashMetadata}:${ipfsHashImage}:${signature}`,
    'EX',
    config.redis.expirationData
  )

  res.status(200).json({
    status: 'success',
    ipfsHashMetadata,
    ipfsHashImage,
    signature,
    signerAddress: signer.address,
  })
}
