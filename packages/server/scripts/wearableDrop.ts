import * as Fs from 'fs'
import axios from 'axios'
import { Log } from '../libs/logger'
import { config } from '../libs/config'

const logger = Log({ service: 'script:wearableDrop' })

async function getContractCallers(address: string){
  const callers = new Set()
  const resTxs: any = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&apikey=${config.etherscanKey}`)
  resTxs.data.result.forEach( (tx: any) => callers.add(tx.from.toLowerCase()) )
  return Array.from(callers)
}

async function getPoapOwners(event: string){
  const query = `
query($event: String, $skip: Int){
  tokens(skip: $skip, where: {event: $event}) {
    owner {
      id
    }
  }
}
`
  let skip = 0
  let isEnd = false
  const poapOwners = new Set()
  while (!isEnd){
    const resOwners = await axios.post('https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai', { query, variables: {
        event,
        skip
      } })
    resOwners.data.data.tokens.forEach( (entry: any) => poapOwners.add(entry.owner.id.toLowerCase()) )
    if(resOwners.data.data.tokens.length !== 100){
      isEnd = true
    } else {
      skip += 100
    }
  }
  return Array.from(poapOwners)

}
async function Main(){
  const [callers, poapOwners]  = await Promise.all([
    getContractCallers('0x0583ce2dc21d4d6b7cdcf599ca6cc03043652ef3'),
    getPoapOwners('3669')
  ])
  const merged = Array.from(new Set(callers.concat(poapOwners)) )
  debugger
  const path = `./backup/${new Date(
    new Date().toUTCString()
  ).toISOString()}_wearableDrop.json`
  Fs.writeFileSync(path, JSON.stringify(Array.from(merged), null, 2))

}

Main().catch((error) => logger.error('etherscanTxs main error', error))
