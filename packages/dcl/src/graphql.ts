import config from './config'

export interface AvantGardeToken {
  id: string
  owner: string
  tokenURI: string
  mintTimestamp: string
  mintPrice?: string
  burnTimestamp?: string
  burnPrice?: string,
  metadata?: AvantGardeTokenMetadata
}

export interface AvantGardeTokenMetadata {
  name: string
  image: string
  description: string
  external_url: string
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

export const TokensQuery = `{
  avantGardeTokens(
      first: 100
      skip: 0
      orderBy: mintTimestamp
      orderDirection: desc
  ) {
    id
    owner
    tokenURI
    mintTimestamp
    mintPrice
    burnTimestamp
    burnPrice
  }
}`
// export const MyTokensQuery = gql`
//   query MyTokensQuery($address: String!, $first: Int, $skip: Int) {
//     avantGardeTokens(
//       first: $first
//       skip: $skip
//       orderBy: mintTimestamp
//       orderDirection: desc
//       where: { owner: $address }
//     ) {
//       id
//       owner
//       tokenURI
//       mintTimestamp
//       mintPrice
//       burnTimestamp
//       burnPrice
//       #metadata {
//       #  name
//       #  description
//       #  external_url
//       #  image
//       #}
//     }
//   }
// `


export function getPieces(): Promise<AvantGardeToken[]>{
  return executeTask(async () => {
    try {
      const response = await fetch(config.subgraphUrl, {
        method: 'POST',
        body: JSON.stringify({
          query: TokensQuery
        })
      })
      const json = await response.json()
      const avantGardes: AvantGardeToken[] = await Promise.all(json.data.avantGardeTokens.map( async (avantGardeToken: AvantGardeToken): Promise<AvantGardeToken> => {
        const metadataHash = avantGardeToken.tokenURI.split('ipfs://')[1]
        const response = await fetch(`${config.ipfsEndpoint}${metadataHash}`)
        avantGardeToken.metadata = await response.json()
        return avantGardeToken
      }) )
      return avantGardes
    } catch (error){

      log("failed to reach URL getPieces", error)
      return []
    }
  })

}

export function getPieceByAddress(address: string): Promise<AvantGardeToken>{
  return executeTask(async () => {
    try {
      const response = await fetch(config.subgraphUrl, {
        method: 'POST',
        body: JSON.stringify({
          query: TokenQuery,
          variables: {
            address
          }
        })
      })
      const json = await response.json()
      const metadataHash = json.data.avantGardeToken.tokenURI.split('ipfs://')[1]
      const responseMetadata = await fetch(`${config.ipfsEndpoint}${metadataHash}`)
      json.data.avantGardeToken.metadata = await responseMetadata.json()
      return json.data.avantGardeToken
    } catch (error){

      log("failed to reach URL getPieceByAddress", error)
      return false
    }
  })

}
