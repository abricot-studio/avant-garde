import { log, ipfs, JSONValue, Value } from '@graphprotocol/graph-ts'
import { ArbArt, Minted, Transfer, Burned } from '../generated/ArbArt/ArbArt'
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

export function handleMinted(event: Minted): void {

  let tokenId = event.params.tokenId.toHexString()
  let arbArt = ArbArtToken.load(tokenId)
  let contract = ArbArt.bind(event.address)

  if(arbArt === null){

    arbArt = new ArbArtToken(tokenId)
    let tokenURI = contract.tokenURI(event.params.tokenId)
    arbArt.tokenURI = tokenURI

  }

  arbArt.mintTimestamp = event.block.timestamp
  arbArt.mintPrice = event.params.mintPrice

  let owner = contract.ownerOf(event.params.tokenId)
  arbArt.owner = owner

  // arbArt.metadata = tokenId

  arbArt.save()

  // let ipfsProtocolSuffix = 'ipfs://';
  // let ipfsHash = tokenURI.substring(ipfsProtocolSuffix.length)
  // ipfs.mapJSON(tokenURI, 'processItem', Value.fromString(arbArt.id.toString()))

}

export function handleBurned(event: Burned): void {

  let tokenId = event.params.tokenId.toHexString()

  let arbArt = ArbArtToken.load(tokenId)
  arbArt.burnTimestamp = event.block.timestamp
  arbArt.burnPrice = event.params.burnPrice

  arbArt.save()

}

export function handleTransfer(event: Transfer): void {

  let tokenId = event.params.tokenId.toHexString()
  let to = event.params.to

  let arbArt = ArbArtToken.load(tokenId)

  if(arbArt === null){

    arbArt = new ArbArtToken(tokenId)
    let contract = ArbArt.bind(event.address)
    let tokenURI = contract.tokenURI(event.params.tokenId)
    arbArt.mintTimestamp = event.block.timestamp
    arbArt.tokenURI = tokenURI

  }

  arbArt.owner = to
  arbArt.save()

}
