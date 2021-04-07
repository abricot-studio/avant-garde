import { ethers } from 'hardhat'
import { signMintingRequest } from '../lib/AvantGarde'
import Deployments from '../deployments/localhost/AvantGarde.json'

import ipfsHttp from 'ipfs-http-client'
const IPFS_DOMAIN = 'http://localhost:5001'
const ipfs = ipfsHttp({ url: IPFS_DOMAIN })

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
  console.log('Seeding...')

  const buffer = new TextEncoder().encode(JSON.stringify(metadata))
  const file = await ipfs.add(buffer)
  const uri = file.cid.toString()
  console.log('Uploaded metadata to IPFS. cid: ', uri);

  const accounts = await ethers.getSigners()

  const contractAddress = Deployments.address;
  const contract = await ethers.getContractAt('AvantGarde', contractAddress)

  const manager = new ethers.Wallet('0x630af0fbddb248b53f97ecf899ce11878d9dcd7e718574c92607153027632135')
  const minter = accounts[0]
  const signature = await signMintingRequest(uri, minter.address, manager)

  const value = await contract.currentMintWithFeesPrice()
  await contract.connect(minter).mint(uri, signature, {
    value
  })

  console.log('Contract deployed. address:', contract.address)
  console.log('Manager:', manager.address)
  console.log('Minter:', minter.address)
  console.log('Seeded data.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
