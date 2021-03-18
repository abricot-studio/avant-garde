import type { NextApiRequest, NextApiResponse } from 'next'
import loadTf from 'tfjs-node-lambda'
import axios from 'axios'
import { tmpdir } from 'os'
import Redis from 'ioredis'

import { config } from '../../config'
import { Log } from '../../logger'
import { Render } from '../../image/render'
import generate from '../../image/generate'
import pinata from '../../pinata'

const logger = Log({ service: 'generation' })
const redis = new Redis(config.redis.host, {
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
})

let tf: typeof import('@tensorflow/tfjs') = null

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const address = req.body.address
  const resSetNx = await redis.set(address, 'processing', 'NX', 'EX', config.redis.expiration)
  logger.info('resSetNx', { resSetNx })

  if(resSetNx === 'OK'){

    const existIpfsHash = await pinata.find(address)

    if (existIpfsHash) {
      logger.info('existIpfsHash', { address, existIpfsHash })
      res.status(200).json({
        status: 'success',
        ipfsHash: existIpfsHash,
      })
    } else {

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
      const ipfsHash = await pinata.upload(path, address)
      await render.viewer.rm(address)

      logger.info('end processing', { address, ipfsHash })

      res.status(200).json({
        status: 'success',
        ipfsHash: ipfsHash,
      })
    }

    await redis.del(address);

  } else {

    logger.info('processing', { address })
    res.status(200).json({
      status: 'processing',
      ipfsHash: null,
    })
  }
}
