import { ethers } from 'hardhat'
import { expect } from 'chai'

import { MANAGER_ROLE, signMintingRequest } from '../lib/ArbArt'

const memory: any = {}

const tokenURI = (uri: string) => `ipfs://${uri}`

describe('ArbArt', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
    memory.Contract = await ethers.getContractFactory('ArbArt')
  })

  beforeEach(async () => {
    memory.deployer = memory.signers[0]
    memory.manager = memory.signers[memory.signers.length -1]
    memory.other = memory.signers[1]

    memory.contract = await memory.Contract.deploy(memory.manager.address)
    await memory.contract.deployed()
  })

  it('sets up the contract', async () => {
    expect(await memory.contract.name()).to.eq('ArbArt')
    expect(await memory.contract.symbol()).to.eq('ARBT')
    expect(await memory.contract.hasRole(MANAGER_ROLE, memory.manager.address))
      .to.be.true
    expect(await memory.contract.hasRole(MANAGER_ROLE, memory.other.address)).to
      .be.false
    expect(await memory.contract.hasRole(MANAGER_ROLE, memory.deployer.address)).to
      .be.false

  })

  it('mint', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const signature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.manager
    )

    await memory.contract
      .connect(memory.other)
      .mint(uri, memory.manager.address, signature)

    const tokenId = memory.other.address
    expect(await memory.contract.ownerOf(tokenId)).to.eq(memory.other.address)
    expect(await memory.contract.tokenURI(tokenId)).to.eq(tokenURI(uri))
  })

  it("can't mint two times", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const signature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, memory.manager.address, signature)

    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, memory.manager.address, signature)
    ).to.be.revertedWith('ERC721: token already minted')
  })

  it("can't mint with signer not manager", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const validSignature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.manager
    )
    const invalidSignature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.other
    )

    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, memory.other.address, validSignature)
    ).to.be.revertedWith('Only accepting signatures from MANAGER_ROLE')
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, memory.other.address, invalidSignature)
    ).to.be.revertedWith('Only accepting signatures from MANAGER_ROLE')
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, memory.manager.address, invalidSignature)
    ).to.be.revertedWith('Invalid recovered address')
  })
})
