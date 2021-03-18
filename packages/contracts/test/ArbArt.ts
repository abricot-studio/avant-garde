import { ethers } from "hardhat";

const { expect } = require('chai')

const { MANAGER_ROLE, signMintingRequest } = require('../lib/ArbArt')

const memory: any = {};

describe('ArbArt', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
    memory.Contract = await ethers.getContractFactory('ArbArt')
  })

  beforeEach(async () => {
    memory.baseURI = 'afuihez'
    memory.contract = await memory.Contract.deploy(memory.baseURI)
    await memory.contract.deployed()
    
    memory.manager = memory.signers[0];
    memory.other = memory.signers[1]
  })

  it('sets up the contract', async () => {
    expect(await memory.contract.baseURI()).to.eq(memory.baseURI)
    expect(await memory.contract.name()).to.eq('ArbArt')
    expect(await memory.contract.symbol()).to.eq('ARBT')
    expect(await memory.contract.hasRole(MANAGER_ROLE, memory.manager.address)).to.be.true
    expect(await memory.contract.hasRole(MANAGER_ROLE, memory.other.address)).to.be.false
  })

  it('mint', async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signMintingRequest(uri, memory.other.address,memory.manager);

    await memory.contract.connect(memory.other).mint(uri, memory.manager.address, signature)

    const tokenId = memory.other.address
    expect(await memory.contract.ownerOf(tokenId)).to.eq(memory.other.address)
    expect(await memory.contract.tokenURI(tokenId)).to.eq(`${memory.baseURI}${uri}`)
  })

  it("can't mint two times", async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signMintingRequest(uri, memory.other.address, memory.manager);
    await memory.contract.connect(memory.other).mint(uri, memory.manager.address, signature)

    await expect(
      memory.contract.connect(memory.other).mint(uri, memory.manager.address, signature)
    ).to.be.revertedWith('ERC721: token already minted')
  })
  
  it("can't mint with signer not manager", async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const validSignature = await signMintingRequest(uri, memory.other.address,memory.manager);
    const invalidSignature = await signMintingRequest(uri, memory.other.address,memory.other);

    await expect(
      memory.contract.connect(memory.other).mint(uri, memory.other.address, validSignature)
    ).to.be.revertedWith('Only accepting signatures from MANAGER_ROLE')
    await expect(
      memory.contract.connect(memory.other).mint(uri, memory.other.address, invalidSignature)
    ).to.be.revertedWith('Only accepting signatures from MANAGER_ROLE')
    await expect(
      memory.contract.connect(memory.other).mint(uri, memory.manager.address, invalidSignature)
    ).to.be.revertedWith('Invalid recovered address')
  })

  it('update base URI', async () => {
    const newBaseURI = 'azetrdfc'
    await memory.contract.connect(memory.manager).setBaseURI(newBaseURI)
    expect(await memory.contract.baseURI()).to.eq(newBaseURI)

    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signMintingRequest(uri, memory.other.address,memory.manager);
    await memory.contract.connect(memory.other).mint(uri, memory.manager.address, signature)
    expect(await memory.contract.tokenURI(memory.other.address)).to.eq(`${newBaseURI}${uri}`)

    await expect(
      memory.contract.connect(memory.other).setBaseURI(newBaseURI)
    ).to.be.revertedWith('Only MANAGER_ROLE can call this method')
  })

})
