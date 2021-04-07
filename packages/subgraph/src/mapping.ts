import { log, ipfs, JSONValue, Value } from '@graphprotocol/graph-ts'
import { AvantGarde, Minted, Transfer, Burned } from '../generated/AvantGarde/AvantGarde'
import { AvantGardeToken, AvantGardeTokenMetadata } from '../generated/schema'

export function processItem(value: JSONValue, avantGardeTokenId: Value): void {
  let metadata = value.toObject()

  let avantGardeTokenMetadata = new AvantGardeTokenMetadata(avantGardeTokenId.toString())
  avantGardeTokenMetadata.image = metadata.get('image').toString()
  avantGardeTokenMetadata.name = metadata.get('name').toString()
  avantGardeTokenMetadata.description = metadata.get('description').toString()
  avantGardeTokenMetadata.external_url = metadata.get('external_url').toString()
  avantGardeTokenMetadata.parent = avantGardeTokenId.toString()
  avantGardeTokenMetadata.save()
}

export function handleMinted(event: Minted): void {

  let tokenId = event.params.tokenId.toHexString()
  let avantGarde = AvantGardeToken.load(tokenId)
  let contract = AvantGarde.bind(event.address)

  if(avantGarde === null){

    avantGarde = new AvantGardeToken(tokenId)
    let tokenURI = contract.tokenURI(event.params.tokenId)
    avantGarde.tokenURI = tokenURI

  }

  avantGarde.mintTimestamp = event.block.timestamp
  avantGarde.mintPrice = event.params.mintPrice

  let owner = contract.ownerOf(event.params.tokenId)
  avantGarde.owner = owner

  // avantGarde.metadata = tokenId

  avantGarde.save()

  // let ipfsProtocolSuffix = 'ipfs://';
  // let ipfsHash = tokenURI.substring(ipfsProtocolSuffix.length)
  // ipfs.mapJSON(tokenURI, 'processItem', Value.fromString(avantGarde.id.toString()))

}

export function handleBurned(event: Burned): void {

  let tokenId = event.params.tokenId.toHexString()

  let avantGarde = AvantGardeToken.load(tokenId)
  avantGarde.burnTimestamp = event.block.timestamp
  avantGarde.burnPrice = event.params.burnPrice

  avantGarde.save()

}

export function handleTransfer(event: Transfer): void {

  let tokenId = event.params.tokenId.toHexString()
  let to = event.params.to

  let avantGarde = AvantGardeToken.load(tokenId)

  if(avantGarde === null){

    avantGarde = new AvantGardeToken(tokenId)
    let contract = AvantGarde.bind(event.address)
    let tokenURI = contract.tokenURI(event.params.tokenId)
    avantGarde.mintTimestamp = event.block.timestamp
    avantGarde.tokenURI = tokenURI

  }

  avantGarde.owner = to
  avantGarde.save()

}
