export interface ConfigPinata {
  apiKey: string
  apiSecret: string
}

export interface ConfigRedis {
  host: string
  expiration: number
}

export interface ConfigImage {
  width: number
  height: number
  scale: number
  blackWhite: boolean
  batchSize: number
  outputsDir: string
}

export interface Config {
  env: string
  image: ConfigImage
  pinata: ConfigPinata
  redis: ConfigRedis
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  image: {
    width: parseInt(process.env.IMAGE_WIDTH || '200', 10),
    height: parseInt(process.env.IMAGE_HEIGHT || '200', 10),
    scale: parseInt(process.env.IMAGE_SCALE || '10', 10),
    blackWhite: Boolean(process.env.IMAGE_BLACK_WHITE),
    batchSize: parseInt(process.env.IMAGE_BATCH_SIZE || '1000', 10),
    outputsDir: process.env.IMAGE_OUTPUTS_DIR || '.',
  },
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST,
    expiration: parseInt(process.env.REDIS_EXPIRATION || '120', 10),
  },
}

export { config }
