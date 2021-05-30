import * as crypto from '@dcl/crypto-scene-utils'
import {getUserAccount} from "@decentraland/EthereumController"
import * as EthConnect from 'eth-connect'
import { getProvider } from '@decentraland/web3-provider'
import RequestManager, { BigNumber, toChecksumAddress } from 'eth-connect'
import * as utils from '@dcl/ecs-scene-utils'
import avantGardeNetwork from "./networks"
import config from './config'

interface mintParams {
  status: string,
  ipfsHashMetadata: string
  ipfsHashImage: string
  signature: string
  signerAddress: string
}

interface networkConfig {
  network: string
  address: string
  contract: any
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
  contract?: any
  requestManager?: RequestManager
  mintPrices: mintPrices = {
    currentPrice: '0',
    fees: '0',
    total: '0',
  }

  constructor() {

  }

  async init(){

    const { network, address, contract, requestManager } = await this.getNetworkConfig()
    this.network = network
    this.address = address
    this.contract = contract
    this.requestManager = requestManager
    this.mintPrices = await this.getMintPrice()

  }

  getNetworkConfig(): Promise<networkConfig>{

    return executeTask(async (): Promise<networkConfig> => {
      try {
        const provider = await getProvider()
        const requestManagerNet = new EthConnect.RequestManager(provider)
        const network = await requestManagerNet.net_version()
        log('network', network)
        const getContract = await crypto.contract.getContract(avantGardeNetwork[4].address, avantGardeNetwork[4].abi) as any
        const contract = getContract.contract
        const requestManager = getContract.requestManager
        const address = toChecksumAddress(await getUserAccount() )
        return { network, contract, requestManager, address }
      } catch (error) {
        log(error.toString())
        throw error
      }
    })

  }

  getMintPrice(): Promise<any>{

    return executeTask(async () => {

      const res: BigNumber[] = await this.contract.currentMintPrice()
      return {
        currentPrice: res[0].toString(),
        fees: res[1].toString(),
        total: res[0].plus(res[1]).toString(),
      }
    })

  }

  mint(): Promise<any>{

    return executeTask(async () => {

      try {

        const response = await fetch(config.generateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ address: this.address })
        })
        const mintParams: mintParams = await response.json()

        let res = null

        res = await this.contract?.mint(
          mintParams.ipfsHashMetadata,
          mintParams.signature,
          {
            from: this.address,
            value: this.mintPrices.total
          }
        )
        log('contract:mint', 'res', res)

        let receipt = null
        while (receipt == null) {
          await new Promise( resolve => new utils.Delay(2000, resolve) )
          receipt = await this.requestManager?.eth_getTransactionReceipt(res.toString())
        }
        log('contract:mint', 'receipt', receipt)

      } catch (error) {
        log(error.toString())
        throw error
      }
    })
  }

}
