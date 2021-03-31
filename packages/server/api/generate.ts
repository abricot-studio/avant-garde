import { VercelRequest, VercelResponse } from '@vercel/node'
import loadTf from 'tfjs-node-lambda'
import axios from 'axios'
import { tmpdir } from 'os'
import { Wallet } from '@ethersproject/wallet'
import { getAddress } from 'ethers/lib/utils'

import { config } from '../libs/config'
import { Log } from '../libs/logger'
import { getRedis } from '../libs/redis'
import { Render } from '../libs/image/render'
import generate from '../libs/image/generate'
import Pinata from '../libs/pinata'
import { signURI } from '../libs/sign'

const logger = Log({ service: 'generation' })

let tf: typeof import('@tensorflow/tfjs') = null
const signer = new Wallet(config.privateKey)

export default async (req: VercelRequest, res: VercelResponse) => {

  if(req.method === 'OPTIONS') {

    return res.status(200).end()

  }

  let address = null;

  try {

    address = getAddress(req.body.address)

  } catch (error){

    logger.error('Address invalid', {
      address,
      error
    })

    return res.status(400).json({
      status: 'error',
      message: 'address is not valid',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
      signerAddress: signer.address
    })

  }

  const existIpfsHash = await Pinata.find(address)

  if (existIpfsHash) {
    logger.info('existIpfsHash', {
      address,
      ipfsHashMetadata: existIpfsHash.ipfsHashMetadata,
      ipfsHashImage: existIpfsHash.ipfsHashImage
    })
    const signature = await signURI(existIpfsHash.ipfsHashMetadata, address, signer);

    return res.status(200).json({
      status: 'success',
      ipfsHashMetadata: existIpfsHash.ipfsHashMetadata,
      ipfsHashImage: existIpfsHash.ipfsHashImage,
      signature,
      signerAddress: signer.address
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
      signature: null,
      signerAddress: signer.address
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
  const signature = await signURI(ipfsHashMetadata, address, signer);

  res.status(200).json({
    status: 'success',
    ipfsHashMetadata,
    ipfsHashImage,
    signature,
    signerAddress: signer.address
  })

}
