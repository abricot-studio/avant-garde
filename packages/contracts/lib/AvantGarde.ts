import { Signer, utils } from 'ethers'

export async function signMintingRequest(
  uri: string,
  minter: string,
  signer: Signer
): Promise<string> {
  const aURI = utils.toUtf8Bytes(uri)
  const aMinter = utils.arrayify(minter)
  const message = utils.concat([aURI, aMinter])

  const hash = utils.keccak256(message)
  const aHash = utils.arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}
