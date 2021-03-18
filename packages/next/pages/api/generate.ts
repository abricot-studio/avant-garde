import type { NextApiRequest, NextApiResponse } from 'next'
import loadTf from 'tfjs-node-lambda'
import axios from 'axios'
import { tmpdir } from 'os'

import { config } from '@libs/config'
import { Log } from '@libs/logger'
import { getRedis } from '@libs/redis'
import { Render } from '@libs/image/render'
import generate from '@libs/image/generate'
import Pinata from '@libs/pinata'

const logger = Log({ service: 'generation' })

let tf: typeof import('@tensorflow/tfjs') = null

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const address = req.body.address

  const existIpfsHash = await Pinata.find(address)

  if (existIpfsHash) {
    logger.info('existIpfsHash', {
      address,
      ipfsHashMetadata: existIpfsHash.ipfsHashMetadata,
      ipfsHashImage: existIpfsHash.ipfsHashImage
    })
    return res.status(200).json({
      status: 'success',
      ipfsHashMetadata: existIpfsHash.ipfsHashMetadata,
      ipfsHashImage: existIpfsHash.ipfsHashImage
    })
  }

  const redis = await getRedis()
  const resSetNx = await redis.set(address, 'processing', 'NX', 'EX', config.redis.expiration)
  logger.info('resSetNx', { resSetNx })

  if (resSetNx !== 'OK') {

    logger.info('processing', { address })
    return res.status(200).json({
      status: 'processing',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
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

  logger.info('end processing', { address, ipfsHashMetadata, ipfsHashImage })

  await redis.del(address)
  res.status(200).json({
    status: 'success',
    ipfsHashMetadata,
    ipfsHashImage,
  })

}
