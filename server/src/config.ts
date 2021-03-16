import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface Config {
  port: number;
  env: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
};

export { config };
