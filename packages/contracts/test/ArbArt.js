const { expect } = require('chai')

const MANAGER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER_ROLE'))

async function signURI(uri, signer) {
  const aURI = ethers.utils.toUtf8Bytes(uri);
  const aAddress = ethers.utils.arrayify(await signer.getAddress());
  const message = ethers.utils.concat([aURI, aAddress]);

  const hash = ethers.utils.keccak256(message);
  const aHash = ethers.utils.arrayify(hash);

  const signature = await signer.signMessage(aHash);
  return signature;
}

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
    const signature = await signURI(uri, this.manager);

    await this.contract.connect(this.other).mint(uri, this.manager.address, signature)

    const tokenId = this.other.address
    expect(await this.contract.ownerOf(tokenId)).to.eq(this.other.address)
    expect(await this.contract.tokenURI(tokenId)).to.eq(`${this.baseURI}${uri}`)
  })

  it("can't mint two times", async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signURI(uri, this.manager);
    await this.contract.connect(this.other).mint(uri, this.manager.address, signature)

    await expect(
      this.contract.connect(this.other).mint(uri, this.manager.address, signature)
    ).to.be.revertedWith('ERC721: token already minted')
  })
  
  it("can't mint with signer not manager", async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const validSignature = await signURI(uri, this.manager);
    const invalidSignature = await signURI(uri, this.other);

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
    const signature = await signURI(uri, this.manager);
    await this.contract.connect(this.other).mint(uri, this.manager.address, signature)
    expect(await this.contract.tokenURI(this.other.address)).to.eq(`${newBaseURI}${uri}`)

    await expect(
      this.contract.connect(this.other).setBaseURI(newBaseURI)
    ).to.be.revertedWith('Only MANAGER_ROLE can call this')
  })

})
