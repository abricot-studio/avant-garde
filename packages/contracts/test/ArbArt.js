const { expect } = require('chai')

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
})
