import { Transfer } from '../generated/ArbArt/ArbArt'
import { ArbArtToken } from '../generated/schema'

export function handleTransfer(event: Transfer): void {

  let tokenId = event.params.tokenId.toHex();
  let to = event.params.to;

  let arbArt = ArbArtToken.load(tokenId)
  if(arbArt === null) {
    arbArt = new ArbArtToken(tokenId)
  }
  arbArt.owner = to
  arbArt.save()

}
