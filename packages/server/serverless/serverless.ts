import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'generate',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      QUEUE_TABLE: 'QUEUE_TABLE'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello },
  resources: {
    Resources: {
      DynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'address',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'address',
              KeyType: 'HASH'
            }
          ],
          TimeToLiveSpecification: {
            AttributeName: 'expires',
            Enabled: true
          },
          BillingMode: 'PAY_PER_REQUEST',
          TableName: 'QUEUE_TABLE'
        }
      },
      generateRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
                }
              }
            ]
          },
          Path: '/',
          RoleName: 'generate',
          Policies: [{
            PolicyName: 'generate-generateRole',
            PolicyDocument: {
              Version: '2012-10-17',
              Statement: [{
                Action: ['dynamodb:PutItem', 'dynamodb:GetItem'],
                Effect: 'Allow',
                Resource: [{
                  'Fn::GetAtt': ['DynamoDbTable', 'Arn'],
                }]
              }],
            }
          }]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
