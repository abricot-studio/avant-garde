const fs = require("fs");
import { ethers } from 'hardhat'
import { signMintingRequest } from '../lib/ArbArt'

const ipfsHttp = require('ipfs-http-client')
const IPFS_DOMAIN = 'http://localhost:5001'
const ipfs = ipfsHttp(IPFS_DOMAIN)

const metadata = {
  image: 'ipfs://QmXYK43wPMNoQyoCvvBQ2YWmUbsfgk1CMsH4QtFnELPzdE',
  description: 'Art of 0xcDA72070E455bb31C7690a170224Ce43623d0B6f',
  external_url: 'https://art.art/id/0xcDA72070E455bb31C7690a170224Ce43623d0B6f',
  name: '0xcDA72070E455bb31C7690a170224Ce43623d0B6f',
  background_color: '585858',
  attributes: [
    {
      display_type: 'date',
      trait_type: 'birthday',
      value: '1616088516870',
    },
  ],
}

async function main() {
  const contractName = 'ArbArt';

  const accounts = await ethers.getSigners()
  const contractAddress = fs.readFileSync(`./artifacts/${contractName}.address`).toString();
  const contract = await ethers.getContractAt(contractName, contractAddress)

  const buffer = new TextEncoder().encode(JSON.stringify(metadata))
  const file = await ipfs.add(buffer)

  const uri = file.cid.toString()
  const manager = accounts[0]
  const minter = accounts[1]
  const signature = await signMintingRequest(uri, minter.address, manager)

  await contract.connect(minter).mint(uri, manager.address, signature)

  console.log('Seeded data.')
  console.log('Contract address:', contract.address)
  console.log('Token URI:', uri)
  console.log('Manager:', manager.address)
  console.log('Minter:', minter.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
