export interface ConfigPinata {
  apiKey: string
  apiSecret: string
  externalUrlBase: string
}

export interface ConfigRedis {
  url: string
  expirationProcessing: number
  expirationData: number
}

export interface ConfigImage {
  width: number
  height: number
  scale: number
  blackWhite: boolean
  batchSize: number
  outputsDir: string
}

export interface ConfigTwitter {
  enable: boolean
  consumerKey: string
  consumerSecret: string
  accessTokenKey: string
  accessTokenSecret: string
}

export interface ConfigDiscord {
  enable: boolean
  webHook: string
}

export interface ConfigHook {
  secret: string
  discord: ConfigDiscord
  twitter: ConfigTwitter
}

export interface Config {
  env: string
  image: ConfigImage
  pinata: ConfigPinata
  redis: ConfigRedis
  privateKey: string
  alchemyApiKey: string
  hook: ConfigHook
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  hook: {
    secret: process.env.HOOK_SECRET || '1d8c3623fb5ae3e6da37edfaad82794be462',
    discord: {
      enable: process.env.HOOK_DISCORD_ENABLE === 'true',
      webHook: process.env.HOOK_DISCORD_WEB_HOOK || '',
    },
    twitter: {
      enable: process.env.HOOK_TWITTER_ENABLE === 'true',
      consumerKey: process.env.HOOK_TWITTER_CONSUMER_KEY || '',
      consumerSecret: process.env.HOOK_TWITTER_CONSUMER_SECRET || '',
      accessTokenKey: process.env.HOOK_TWITTER_ACCESS_TOKEN_KEY || '',
      accessTokenSecret: process.env.HOOK_TWITTER_ACCESS_TOKEN_SECRET || '',
    },
  },
  alchemyApiKey: process.env.ALCHEMY_API_KEY || '',
  image: {
    width: parseInt(process.env.IMAGE_WIDTH || '512', 10),
    height: parseInt(process.env.IMAGE_HEIGHT || '512', 10),
    scale: parseInt(process.env.IMAGE_SCALE || '10', 10),
    blackWhite: Boolean(process.env.IMAGE_BLACK_WHITE),
    batchSize: parseInt(process.env.IMAGE_BATCH_SIZE || '1000', 10),
    outputsDir: process.env.IMAGE_OUTPUTS_DIR || '.',
  },
  pinata: {
    apiKey: process.env.PINATA_API_KEY || '',
    apiSecret: process.env.PINATA_API_SECRET || '',
    externalUrlBase:
      process.env.PINATA_EXTERNAL_URL_BASE ||
      'https://beta.avant-garde.gallery/token/',
  },
  privateKey:
    process.env.PRIVATE_KEY ||
    '0x630af0fbddb248b53f97ecf899ce11878d9dcd7e718574c92607153027632135', //0xE4D29ec42F4057EfF92c9124c82844b2689f9C6d
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    expirationProcessing: parseInt(
      process.env.REDIS_EXPIRATION_PROCESSING || '120',
      10
    ), // 2 min
    expirationData: parseInt(process.env.REDIS_EXPIRATION_DATA || '604800', 10), // 1 week
  },
}

export { config }
