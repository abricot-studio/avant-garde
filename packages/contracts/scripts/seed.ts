import { ethers } from 'hardhat'
import { signMintingRequest } from '../lib/ArbArt';

async function main() {

  const accounts = await ethers.getSigners()
  const Contract = await ethers.getContractFactory('ArbArt')
  const contract = await Contract.deploy('https://gateway.pinata.cloud/ipfs/');

  const uri = 'QmV4YhMmTkoB2y18LX5ki5siXTSkE7cbj5dAoAtcbJCyQF';
  const manager = accounts[0];
  const minter = accounts[1];
  const signature = await signMintingRequest(uri, minter.address, manager);

  await contract.connect(minter).mint(uri, manager.address, signature)

  console.log('Seeded data.')
  console.log('Contract address:', contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
