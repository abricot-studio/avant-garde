import { DynamoDB } from 'aws-sdk';
const dynamoDb = new DynamoDB.DocumentClient();

export const gen = async (event: any, context: any, callback: any) => {
  const address = event.address;
  dynamoDb.get({
    TableName: process.env.QUEUE_TABLE,
    Key: {
      address: address
    }
  }).promise().then( (result) => {

    console.log('result', result);
    return dynamoDb.put({
      TableName: process.env.QUEUE_TABLE,
      Item: {
        address: address,
        expires: Date.now() / 1000 + 15 * 60 // now + 15 min
      }
    }).promise().then(res => callback({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          address,
        },
        null,
        2
      ),
    }) ).catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t put in queue table.'));
    });

  }).catch(error => {
    console.error(error);
    callback(new Error('Couldn\'t fetch queue table.'));
  });

};
