import fs, {ReadStream} from 'fs';
import assert from 'assert';
import pinataSDK from '@pinata/sdk';
import { Logger } from './logger';
import { config } from './config';

const logger = Logger({ service: 'pinata' });
const pinata = pinataSDK(config.pinata.apiKey, config.pinata.apiSecret);

export async function upload(path: string, address: string): Promise<string> {

  const file: ReadStream = fs.createReadStream(path);

  const options = {
    pinataMetadata: {
      name: config.env === 'production' ? address : address + Date.now(),
    },
    pinataOptions: {
      cidVersion: 1
    }
  };

  return pinata.pinFileToIPFS(file, options).then( (result: any) => {

    assert(result && result.IpfsHash, 'pinata invalid response');
    return result.IpfsHash;

  }).catch( (error: any) => {

    logger.error('pinata error', error);

    throw error;

  });

}

export async function find(address: string): Promise<any> {

  return pinata.pinList({
    metadata: {
      name: address
    }
  }).then( (result: any) => {

    assert(result && Array.isArray(result.rows), 'pinata invalid response');
    return result.rows.length > 0 ? result.rows[0].ipfs_pin_hash : false;

  }).catch( (error: any) => {

    logger.error('pinata error', error);

    throw error;

  });

}

export default { upload, find };
