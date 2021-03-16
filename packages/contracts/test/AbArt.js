const { expect } = require("chai");

describe("AbArt", function() {
  before(async () => {
    this.signers = await ethers.getSigners();
    this.Contract = await ethers.getContractFactory("AbArt");
  });

  beforeEach(async () => {
    this.contract = await this.Contract.deploy();
    await this.contract.deployed();
  });

  it("mint", async () => {
    expect(await this.contract.tokenIds()).to.eq(0)

    const uri = 'caca';

    const oldTokenId = await this.contract.tokenIds();
    await this.contract.connect(this.signers[0]).mint(uri);
    const tokenId = await this.contract.tokenIds();

    expect(tokenId).to.eq(oldTokenId.add(1));
    expect(await this.contract.ownerOf(tokenId)).to.eq(this.signers[0].address)
    expect(await this.contract.tokenURI(tokenId)).to.eq(uri)
    expect(await this.contract.tokenIdOfAddress(this.signers[0].address)).to.eq(tokenId)
    expect(await this.contract.addressOfTokenId(tokenId)).to.eq(this.signers[0].address)
  });

  it("can't mint two times", async () => {
    await this.contract.connect(this.signers[0]).mint('aze');
    expect(this.contract.connect(this.signers[0]).mint('zefr')).to.be.revertedWith("Already minted token for this address");
  });
});
