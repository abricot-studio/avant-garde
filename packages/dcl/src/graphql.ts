import { sendRequest } from '@dcl/ecs-scene-utils'
import config from './config'
import { setTimeout } from './utils'

export interface AvantGardeToken {
  id: string
  owner: string
  tokenURI: string
  mintTimestamp: string
  mintPrice?: string
  burnTimestamp?: string
  burnPrice?: string
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
      first: 18
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

export class Graphql {
  pieces: AvantGardeToken[] = []

  async init() {
    this.startPoolingGetPieces()
  }

  startPoolingGetPieces() {
    this.getPieces()
      .then(() => {
        setTimeout(() => {
          this.startPoolingGetPieces()
        }, 5000)
      })
      .catch((error) => {
        log('error pooling get pieces', error)
        setTimeout(() => {
          this.startPoolingGetPieces()
        }, 5000)
      })
  }

  async getPieces(): Promise<any> {
    return executeTask(async () => {
      const json = await sendRequest(
        config.subgraphUrl,
        'POST',
        {},
        {
          query: TokensQuery,
        }
      )
      await Promise.all(
        json.data.avantGardeTokens.reverse().map(
          async (avantGardeToken: AvantGardeToken) => {
            if (!this.pieces.some((piece) => piece.id === avantGardeToken.id)) {
              const metadataHash = avantGardeToken.tokenURI.split('ipfs://')[1]
              avantGardeToken.metadata = await sendRequest(
                `${config.ipfsEndpoint}${metadataHash}`
              )
              this.pieces.unshift(avantGardeToken)
            }
          }
        )
      )
      log(' pieces', this.pieces)
    })
  }

  async getPieceByAddress(address: string): Promise<AvantGardeToken> {
    return executeTask(async () => {
      try {
        const json = await sendRequest(
          config.subgraphUrl,
          'POST',
          {},
          {
            query: TokenQuery,
            variables: {
              address: address.toLowerCase(),
            },
          }
        )
        const metadataHash =
          json.data.avantGardeToken.tokenURI.split('ipfs://')[1]
        json.data.avantGardeToken.metadata = await sendRequest(
          `${config.ipfsEndpoint}${metadataHash}`
        )
        return json.data.avantGardeToken
      } catch (error) {
        log('failed to reach URL getPieceByAddress', error)
        return false
      }
    })
  }
}
