import { contract } from '@dcl/crypto-scene-utils'
import { getUserAccount } from '@decentraland/EthereumController'
import { getProvider } from '@decentraland/web3-provider'
import RequestManager, { BigNumber, toChecksumAddress } from 'eth-connect'
import { mintParams } from './generate'
import avantGardeNetwork from './networks'
import { setTimeout, wait } from './utils'

interface networkConfig {
  network: string
  address: string
  avantGardeContract: any
  requestManager: any
}

interface mintPrices {
  currentPrice: string
  fees: string
  total: string
}

export default class ContractOperation {
  address?: string
  network?: string
  avantGardeContract?: any
  requestManager?: RequestManager
  mintPrices: mintPrices = {
    currentPrice: '0',
    fees: '0',
    total: '0',
  }

  constructor() {}

  async init() {
    const { network, address, avantGardeContract, requestManager } =
      await this.getNetworkConfig()
    this.network = network
    this.address = address
    this.avantGardeContract = avantGardeContract
    this.requestManager = requestManager
    log('address', this.address)
    log('network', this.network)
    this.startPoolingMintPrice()
  }

  startPoolingMintPrice() {
    this.getMintPrice()
      .then((mintPrices) => {
        this.mintPrices = mintPrices
        setTimeout(() => {
          this.startPoolingMintPrice()
        }, 5000)
      })
      .catch((error) => {
        log('error pooling mint price', error)
        setTimeout(() => {
          this.startPoolingMintPrice()
        }, 5000)
      })
  }

  getNetworkConfig(): Promise<networkConfig> {
    return executeTask(async (): Promise<networkConfig> => {
      try {
        const provider = await getProvider()
        const requestManagerNet = new RequestManager(provider)
        const network = await requestManagerNet.net_version()
        const getContract = (await contract.getContract(
          avantGardeNetwork[4].address,
          avantGardeNetwork[4].abi
        )) as any
        const avantGardeContract = getContract.contract
        const requestManager = getContract.requestManager
        const address = toChecksumAddress(await getUserAccount())
        log('getNetworkConfig', { network, contract, requestManager, address })
        return { network, avantGardeContract, requestManager, address }
      } catch (error) {
        log('error getNetworkConfig', error)
        throw error
      }
    })
  }

  getMintPrice(): Promise<mintPrices> {
    return executeTask(async (): Promise<mintPrices> => {
      const res: BigNumber[] = await this.avantGardeContract.currentMintPrice()
      return {
        currentPrice: res[0].toString(),
        fees: res[1].toString(),
        total: res[0].plus(res[1]).toString(),
      }
    })
  }

  mint(mintParams: mintParams): Promise<string> {
    return executeTask(async () => {
      try {
        let res = null
        res = await this.avantGardeContract.mint(
          mintParams.ipfsHashMetadata,
          mintParams.signature,
          {
            from: this.address,
            value: this.mintPrices.total,
          }
        )
        log('contract:mint', 'res', res)

        const txHash = res.toString()

        log('mint txHash', txHash)

        return txHash
      } catch (error) {
        log('error mint', error)
        throw error
      }
    })
  }

  async waitForTx(txHash: string): Promise<any> {
    let receipt = null
    while (receipt == null) {
      await wait(2000)
      receipt = await this.requestManager?.eth_getTransactionReceipt(txHash)
    }
    return receipt
  }
}
