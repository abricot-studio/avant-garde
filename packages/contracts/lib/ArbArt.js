const MANAGER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER_ROLE'))

async function signMintingRequest(uri, minter, signer) {
  const aURI = ethers.utils.toUtf8Bytes(uri);
  const aMinter = ethers.utils.arrayify(minter);
  const aSigner = ethers.utils.arrayify(await signer.getAddress());
  const message = ethers.utils.concat([aURI, aMinter, aSigner]);

  const hash = ethers.utils.keccak256(message);
  const aHash = ethers.utils.arrayify(hash);

  const signature = await signer.signMessage(aHash);
  return signature;
}

module.exports = { MANAGER_ROLE, signMintingRequest }
