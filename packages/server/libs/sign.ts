import { Wallet } from '@ethersproject/wallet'
import { arrayify, concat, keccak256, toUtf8Bytes } from 'ethers/lib/utils'

export async function signURI(
  uri: string,
  minter: string,
  signer: Wallet
): Promise<string> {
  const aURI = toUtf8Bytes(uri)
  const aMinter = arrayify(minter)
  const message = concat([aURI, aMinter])

  const hash = keccak256(message)
  const aHash = arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}

export default { signURI }
