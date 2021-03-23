import { Signer, utils } from 'ethers'

export const MANAGER_ROLE = utils.keccak256(utils.toUtf8Bytes('MANAGER_ROLE'))

export async function signMintingRequest(
  uri: string,
  minter: string,
  signer: Signer
) : Promise<string> {
  const aURI = utils.toUtf8Bytes(uri)
  const aMinter = utils.arrayify(minter)
  const aSigner = utils.arrayify(await signer.getAddress())
  const message = utils.concat([aURI, aMinter, aSigner])

  const hash = utils.keccak256(message)
  const aHash = utils.arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}
