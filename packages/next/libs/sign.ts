import { arrayify, concat, keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import {Wallet} from '@ethersproject/wallet'

export async function signURI(uri: string, minter: string, signer: Wallet): Promise<string> {

  const aURI = toUtf8Bytes(uri)
  const aMinter = arrayify(minter)
  const aSigner = arrayify(await signer.getAddress())
  const message = concat([aURI, aMinter, aSigner])

  const hash = keccak256(message)
  const aHash = arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature

}

export default { signURI }