import { VercelRequest, VercelResponse } from '@vercel/node'
import Axios from 'axios'
import { promisifyAll } from 'bluebird'
import { providers, utils } from 'ethers'
import Twitter from 'twitter'
import { config } from '../libs/config'
import { Log } from '../libs/logger'
import { Middlewares } from '../libs/middlewares'

const logger = Log({ service: 'txHook' })

const abiInterface = new utils.Interface([
  'event Approval (address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event Transfer (address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Burned (uint256 indexed tokenId, uint256 indexed burnPrice)',
  'event Minted (uint256 indexed tokenId, uint256 indexed mintPrice)',
])

async function onMint(owner, mintPrice, tokenId) {
  if (config.hook.discord.enable) {
    await Axios.post(config.hook.discord.webHook, {
      username: 'Minter Bot',
      content: `${owner} minted ${tokenId} for ${mintPrice} Ξ`,
    })
  }

  if (config.hook.twitter.enable) {
    const client = promisifyAll(
      new Twitter({
        consumer_key: config.hook.twitter.consumerKey,
        consumer_secret: config.hook.twitter.consumerSecret,
        access_token_key: config.hook.twitter.accessTokenKey,
        access_token_secret: config.hook.twitter.accessTokenSecret,
      })
    )

    await client.post('statuses/update', {
      status: `Test m ${mintPrice}`,
    })
  }
}

async function onBurn(owner, burnPrice, tokenId) {
  if (config.hook.discord.enable) {
    await Axios.post(config.hook.discord.webHook, {
      username: 'Burner Bot',
      content: `${owner} burned ${tokenId} for ${burnPrice} Ξ`,
    })
  }

  if (config.hook.twitter.enable) {
    const client = promisifyAll(
      new Twitter({
        consumer_key: config.hook.twitter.consumerKey,
        consumer_secret: config.hook.twitter.consumerSecret,
        access_token_key: config.hook.twitter.accessTokenKey,
        access_token_secret: config.hook.twitter.accessTokenSecret,
      })
    )

    await client.post('statuses/update', {
      status: `Test b ${burnPrice}`,
    })
  }
}

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> => {
  // logger.info('new req body', {body: req.body })
  if(!Middlewares(req, res)) return

  if (req.headers['hook-secret'] !== config.hook.secret) {
    return res.status(400).end()
  }

  const txHash = req.body.txHash
  const network = req.body.network
  const contractAddress = req.body.contractAddress
  const provider = new providers.AlchemyProvider(network, config.alchemyApiKey)

  const tx = await provider.getTransactionReceipt(txHash)

  if (!tx) {
    logger.error('Tx not found', { txHash })
    return res.status(200).end()
  }

  const logsParsed = tx.logs
    .filter((log) => log.address === contractAddress)
    .reduce((acc, log) => {
      try {
        const logParsed = abiInterface.parseLog(log)
        acc.push(logParsed)
      } catch (error) {
        logger.error('failed to parse log', log)
      }

      return acc
    }, [])

  const mintedLog = logsParsed.find((log) => log.name === 'Minted')
  const burnedLog = logsParsed.find((log) => log.name === 'Burned')
  const transferLog = logsParsed.find((log) => log.name === 'Transfer')

  if (mintedLog && transferLog) {
    const owner = transferLog.args.to
    const mintPrice = utils.formatEther(mintedLog.args.mintPrice)
    const tokenId = mintedLog.args.tokenId.toHexString()
    await onMint(owner, mintPrice, tokenId)
    logger.info('Minted log', { owner, mintPrice, tokenId })
  }

  if (burnedLog && transferLog) {
    const owner = transferLog.args.from
    const burnPrice = utils.formatEther(burnedLog.args.burnPrice)
    const tokenId = burnedLog.args.tokenId.toHexString()

    await onBurn(owner, burnPrice, tokenId)
    logger.info('Burned log', { owner, burnPrice, tokenId })
  }

  return res.status(200).end()
}
