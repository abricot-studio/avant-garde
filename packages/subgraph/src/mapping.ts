import { log, ipfs, JSONValue, Value } from '@graphprotocol/graph-ts'
import { ArbArt, Transfer } from '../generated/ArbArt/ArbArt'
import { ArbArtToken, ArbArtTokenMetadata } from '../generated/schema'

export function processItem(value: JSONValue, arbArtTokenId: Value): void {
  let metadata = value.toObject()

  let arbArtTokenMetadata = new ArbArtTokenMetadata(arbArtTokenId.toString())
  arbArtTokenMetadata.image = metadata.get('image').toString()
  arbArtTokenMetadata.name = metadata.get('name').toString()
  arbArtTokenMetadata.description = metadata.get('description').toString()
  arbArtTokenMetadata.external_url = metadata.get('external_url').toString()
  arbArtTokenMetadata.parent = arbArtTokenId.toString()
  arbArtTokenMetadata.save()
}

export function handleTransfer(event: Transfer): void {
  let tokenId = event.params.tokenId.toHexString()
  let to = event.params.to

  let arbArt = ArbArtToken.load(tokenId)
  if (arbArt === null) {
    arbArt = new ArbArtToken(tokenId)
    arbArt.blockTimestamp = event.block.timestamp
  }

  let contract = ArbArt.bind(event.address)
  let tokenURI = contract.tokenURI(event.params.tokenId)

  arbArt.owner = to
  arbArt.tokenURI = tokenURI
  // arbArt.metadata = tokenId
  arbArt.save()

  // let ipfsProtocolSuffix = 'ipfs://';
  // let ipfsHash = tokenURI.substring(ipfsProtocolSuffix.length)
  // ipfs.mapJSON(tokenURI, 'processItem', Value.fromString(arbArt.id.toString()))
}
