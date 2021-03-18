// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";
import pinata from "../../pinata";
// import fs from "fs";
import {Log} from "../../logger";
import {Render} from "../../image/render";
import generate from "../../image/generate";
// import loadTf from 'tfjs-node-lambda';
import { config } from '../../config';

const logger = Log({ service: 'generation' })
import { PrepareTf } from 'tfjs-node-lambda-helpers';
const prepareTf = PrepareTf();

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const address = req.body.address;
  // const resGet = await dynamoDb.get({
  //   TableName: process.env.QUEUE_TABLE,
  //   Key: { address }
  // }).promise();

  if(Object.keys({}).length === 0){

    const existIpfsHash = await pinata.find(address);

    if(existIpfsHash){

      logger.info('existIpfsHash', { existIpfsHash });
      res.status(200).json({
        status: 'success',
        ipfsHash: existIpfsHash
      });

    } else {

      const ready = await prepareTf.next();
      const tf: any = ready.value;

      if(!ready.done && tf && tf.sequential){

        logger.info('processing load tf', { address });

        return res.status(200).json({
          status: 'loading',
          ipfsHash: null
        });

      }


      logger.info('start processing', { address });

      // await dynamoDb.put({
      //   TableName: process.env.QUEUE_TABLE,
      //   Item: {
      //     address,
      //     status: 'processing',
      //     expires: parseInt( (Date.now() / 1000 + 15 * 60).toString(), 10) // now + 15 min
      //   }
      // }).promise();

      const render = new Render(config.image.height, config.image.width, config.image.blackWhite, config.image.outputsDir);
      const path = await generate(address, render, tf);
      const ipfsHash = await pinata.upload(path, address);
      await render.viewer.rm(address);

      // await dynamoDb.delete({
      //   TableName: process.env.QUEUE_TABLE,
      //   Key: { address }
      // }).promise();

      logger.info('end processing', { address, ipfsHash });

      res.status(200).json({
        status: 'success',
        ipfsHash: ipfsHash
      });
    }

  } else {

    logger.info('processing', { address });

    // return formatJSONResponse({
    //   status: 'processing',
    //   ipfsHash: null
    // });

  }

};
