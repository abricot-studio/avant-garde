const { expect } = require('chai')

const { MANAGER_ROLE, signMintingRequest } = require('../lib/ArbArt')

describe('ArbArt', function () {
  before(async () => {
    this.signers = await ethers.getSigners()
    this.Contract = await ethers.getContractFactory('ArbArt')
    
  })

  beforeEach(async () => {
    this.baseURI = 'afuihez'
    this.contract = await this.Contract.deploy(this.baseURI)
    await this.contract.deployed()
    
    this.manager = this.signers[0];
    this.other = this.signers[1]
  })

  it('sets up the contract', async () => {
    expect(await this.contract.baseURI()).to.eq(this.baseURI)
    expect(await this.contract.name()).to.eq('ArbArt')
    expect(await this.contract.symbol()).to.eq('ARBT')
    expect(await this.contract.hasRole(MANAGER_ROLE, this.manager.address)).to.be.true
    expect(await this.contract.hasRole(MANAGER_ROLE, this.other.address)).to.be.false
  })

  it('mint', async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signMintingRequest(uri, this.other.address,this.manager);

    await this.contract.connect(this.other).mint(uri, this.manager.address, signature)

    const tokenId = this.other.address
    expect(await this.contract.ownerOf(tokenId)).to.eq(this.other.address)
    expect(await this.contract.tokenURI(tokenId)).to.eq(`${this.baseURI}${uri}`)
  })

  it("can't mint two times", async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signMintingRequest(uri, this.other.address,this.manager);
    await this.contract.connect(this.other).mint(uri, this.manager.address, signature)

    await expect(
      this.contract.connect(this.other).mint(uri, this.manager.address, signature)
    ).to.be.revertedWith('ERC721: token already minted')
  })
  
  it("can't mint with signer not manager", async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const validSignature = await signMintingRequest(uri, this.other.address,this.manager);
    const invalidSignature = await signMintingRequest(uri, this.other.address,this.other);

    await expect(
      this.contract.connect(this.other).mint(uri, this.other.address, validSignature)
    ).to.be.revertedWith('Only accepting signatures from MANAGER_ROLE')
    await expect(
      this.contract.connect(this.other).mint(uri, this.other.address, invalidSignature)
    ).to.be.revertedWith('Only accepting signatures from MANAGER_ROLE')
    await expect(
      this.contract.connect(this.other).mint(uri, this.manager.address, invalidSignature)
    ).to.be.revertedWith('Invalid recovered address')
  })

  it('update base URI', async () => {
    const newBaseURI = 'azetrdfc'
    await this.contract.connect(this.manager).setBaseURI(newBaseURI)
    expect(await this.contract.baseURI()).to.eq(newBaseURI)

    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signMintingRequest(uri, this.other.address,this.manager);
    await this.contract.connect(this.other).mint(uri, this.manager.address, signature)
    expect(await this.contract.tokenURI(this.other.address)).to.eq(`${newBaseURI}${uri}`)

    await expect(
      this.contract.connect(this.other).setBaseURI(newBaseURI)
    ).to.be.revertedWith('Only MANAGER_ROLE can call this')
  })

})
