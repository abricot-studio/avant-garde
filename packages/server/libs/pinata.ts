import fs, { ReadStream } from 'fs'
import assert from 'assert'
import pinataSDK from '@pinata/sdk'

import { Log } from './logger'
import { config } from './config'

const logger = Log({ service: 'pinata' })
const pinata = pinataSDK(config.pinata.apiKey, config.pinata.apiSecret)

export async function uploadImage(path: string, address: string): Promise<string> {
  const file: ReadStream = fs.createReadStream(path)

  const options = {
    pinataMetadata: {
      name: `file_${config.env === 'production' ? address : address + Date.now()}`,
      keyvalues: {
        address
      }
    },
    pinataOptions: {
      cidVersion: 0,
    }
  }

  return pinata
    .pinFileToIPFS(file, options)
    .then((result: any) => {
      assert(result && result.IpfsHash, 'Pinata uploadFile invalid response')
      return result.IpfsHash
    })
    .catch((error: any) => {
      logger.error('Pinata uploadFile error', error)

      throw error
    })
}

export async function uploadMetadata(ipfsHashImage: string, address: string): Promise<any> {

  const options = {
    pinataMetadata: {
      name: `metadata_${address}`,
      keyvalues: {
        address,
        ipfsHashImage
      }
    },
    pinataOptions: {
      cidVersion: 0
    }
  };

  return pinata.pinJSONToIPFS({
    image: `ipfs://${ipfsHashImage}`,
    description: `Avant garde art of ${address}`,
    external_url: `${config.pinata.externalUrlBase}${address}`,
    name: address,
    // background_color: 'ffffff',
    // attributes: [
    //   {
    //     display_type: 'date',
    //     trait_type: 'birthday',
    //     value: Date.now().toString()
    //   }
    // ]
  }, options)
    .then((result: any) => {
      // logger.info('result uploadMetadata', { result })
      assert(result && result.IpfsHash, 'Pinata uploadMetadata invalid response')
      return result.IpfsHash
    })
    .catch((error: Error) => {
      logger.error('Pinata uploadMetadata error', error)

      throw error
    })

}

export async function find(address: string): Promise<any> {
  return pinata
    .pinList({
      metadata: {
        name: `metadata_${address}`,
      },
    })
    .then((result: any) => {
      // logger.info('result find', { result })
      assert(result && Array.isArray(result.rows), 'Pinata find invalid response')
      return result.rows.length > 0 && !result.rows[0].date_unpinned ? {
        ipfsHashMetadata: result.rows[0].ipfs_pin_hash,
        ipfsHashImage: result.rows[0].metadata.keyvalues.ipfsHashImage,
      } : false
    })
    .catch((error: any) => {
      logger.error('Pinata find error', error)

      throw error
    })
}


export default { uploadImage, find, uploadMetadata }
