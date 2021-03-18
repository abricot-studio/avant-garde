import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk';
import axios from 'axios';
import fs from 'fs'

import { config } from '../../config';
import schema from './schema';
import { Logger } from '@libs/logger'
import pinata from '@libs/pinata';
import generate from '@libs/image/generate';
import {Render} from '@libs/image/render';
const dynamoDb = new DynamoDB.DocumentClient();
import loadTf from 'tfjs-node-lambda';

const logger = Logger({ service: 'generation' })

let tf: typeof import('@tensorflow/tfjs');

const generation: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const address = event.body.address;
  const resGet = await dynamoDb.get({
    TableName: process.env.QUEUE_TABLE,
    Key: { address }
  }).promise();

  if(Object.keys(resGet).length === 0){

    const existIpfsHash = await pinata.find(address);

    if(existIpfsHash){

      logger.info('existIpfsHash', { existIpfsHash });

      return formatJSONResponse({
        status: 'success',
        ipfsHash: existIpfsHash
      });

    } else {

      if(!tf){

        const response = await axios.get(
          'https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.4/nodejs12.x-tf3.3.0.br',
          { responseType: 'arraybuffer' },
        );

        const readStream = fs.createReadStream(response.data);
        tf = await loadTf(readStream);

      }

      logger.info('start processing', { address });

      await dynamoDb.put({
        TableName: process.env.QUEUE_TABLE,
        Item: {
          address,
          status: 'processing',
          expires: parseInt( (Date.now() / 1000 + 15 * 60).toString(), 10) // now + 15 min
        }
      }).promise();

      const render = new Render(config.image.height, config.image.width, config.image.blackWhite, config.image.outputsDir);
      const path = await generate(address, render, tf);
      const ipfsHash = await pinata.upload(path, address);
      await render.viewer.rm(address);

      await dynamoDb.delete({
        TableName: process.env.QUEUE_TABLE,
        Key: { address }
      }).promise();

      logger.info('end processing', { address, ipfsHash });

      return formatJSONResponse({
        status: 'success',
        ipfsHash: ipfsHash
      });

    }

  } else {

    logger.info('processing', { address });

    return formatJSONResponse({
      status: 'processing',
      ipfsHash: null
    });

  }

}

export const main = middyfy(generation);
