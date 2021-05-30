import * as crypto from '@dcl/crypto-scene-utils'
import {getUserAccount} from "@decentraland/EthereumController"
import * as EthConnect from 'eth-connect'
import { getProvider } from '@decentraland/web3-provider'
import * as utils from '@dcl/ecs-scene-utils'
import avantGardeNetwork from "./networks"

export default class ContractOperation {

  address: string = ''
  network: string | null = null

  constructor() {

  }

  async init(){

    this.network = await this.getNetwork()
    this.address = await getUserAccount()

  }

  getNetwork(): Promise<string>{

    return executeTask(async (): Promise<string> => {
      try {
        const provider = await getProvider()
        const requestManagerNet = new EthConnect.RequestManager(provider)
        const network = await requestManagerNet.net_version()
        log('network', network)
        return network
      } catch (error) {
        log(error.toString())
        throw error
      }
    })

  }

  mint(): Promise<any>{

    return executeTask(async () => {
      try {

        const address = await getUserAccount()
        const { contract, requestManager } = await crypto.contract.getContract(avantGardeNetwork[4].address, avantGardeNetwork[4].abi) as any

        let res = null

        res = await contract.mint(
          { from: address }
        )
        log('contract:mint', 'res', res)

        let receipt = null
        while (receipt == null) {
          await new Promise( resolve => new utils.Delay(2000, resolve) )
          receipt = await requestManager.eth_getTransactionReceipt(res.toString())
        }
        log('contract:mint', 'receipt', receipt)

      } catch (error) {
        log(error.toString())
        throw error
      }
    })
  }

}
