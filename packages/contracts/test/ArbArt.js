const { expect } = require('chai')

async function signURI(uri, signer) {
  const message = uri;
  // const message = `${uri}-${await signer.getAddress()}`;
  const uriUtf8 = ethers.utils.toUtf8Bytes(message);
  const hash = ethers.utils.keccak256(uriUtf8);
  const ahash = ethers.utils.arrayify(hash);
  const signature = await signer.signMessage(ahash);
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
  })

  it('sets up the contract', async () => {
    expect(await this.contract.baseURI()).to.eq(this.baseURI)
    expect(await this.contract.name()).to.eq('ArbArt')
    expect(await this.contract.symbol()).to.eq('ARBT')
  })

  it('mint', async () => {
    const uri = 'caca'

    await this.contract.connect(this.signers[0]).mint(uri)

    const tokenId = this.signers[0].address
    expect(await this.contract.ownerOf(tokenId)).to.eq(this.signers[0].address)
    expect(await this.contract.tokenURI(tokenId)).to.eq(`${this.baseURI}${uri}`)
  })

  it("can't mint two times", async () => {
    await this.contract.connect(this.signers[0]).mint('aze')
    await expect(
      this.contract.connect(this.signers[0]).mint('zefr')
    ).to.be.revertedWith('ERC721: token already minted')
  })

  it('update base URI', async () => {
    const newBaseURI = 'azetrdfc'
    await this.contract.connect(this.signers[0]).setBaseURI(newBaseURI)
    expect(await this.contract.baseURI()).to.eq(newBaseURI)

    await expect(
      this.contract.connect(this.signers[1]).setBaseURI(newBaseURI)
    ).to.be.revertedWith('Only manager can call this.')
  })


  it.only('mint acr', async () => {
    const uri = 'Qmsfzefi221ifjzifj';
    const signature = await signURI(uri, this.signers[0]);

    await this.contract.connect(this.signers[0]).mint(uri, this.signers[0].address, signature)
  })
})
