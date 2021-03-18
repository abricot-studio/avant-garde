import { ethers } from "hardhat";

export const MANAGER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER_ROLE'))

export async function signMintingRequest(uri: string, minter: string, signer) {
  const aURI = ethers.utils.toUtf8Bytes(uri);
  const aMinter = ethers.utils.arrayify(minter);
  const aSigner = ethers.utils.arrayify(await signer.getAddress());
  const message = ethers.utils.concat([aURI, aMinter, aSigner]);

  const hash = ethers.utils.keccak256(message);
  const aHash = ethers.utils.arrayify(hash);

  const signature = await signer.signMessage(aHash);
  return signature;
}
