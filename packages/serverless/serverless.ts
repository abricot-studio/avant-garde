import type { AWS } from '@serverless/typescript';

import generation from '@functions/generation';

const serverlessConfiguration: AWS = {
  service: 'generation',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
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
  functions: { generation },
  resources: {
    Resources: {
      DynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
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
          RoleName: 'generation',
          Policies: [{
            PolicyName: 'generation-generateRole',
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
