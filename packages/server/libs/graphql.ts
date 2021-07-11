import axios from 'axios'
import { config } from './config'

export interface AvantGardeToken {
  id: string
  owner: string
  tokenURI: string
  mintTimestamp: string
  mintPrice?: string
  burnTimestamp?: string
  burnPrice?: string
}

export const TokenQuery = `
query($address: String){
  avantGardeToken(id: $address) {
    id
    owner
    tokenURI
    mintTimestamp
    mintPrice
    burnTimestamp
    burnPrice
  }
}`

export async function getTokenById(
  address: string
): Promise<AvantGardeToken | null> {
  return axios
    .post(config.subgraphUrl, {
      query: TokenQuery,
      variables: {
        address: address.toLowerCase(),
      },
    })
    .then(
      (response) =>
        response.data &&
        response.data.data &&
        response.data.data.avantGardeToken
    )
}
