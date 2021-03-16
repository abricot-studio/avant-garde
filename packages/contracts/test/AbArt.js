const { expect } = require("chai");

describe("AbArt", function() {
  before(async () => {
    this.signers = await ethers.getSigners();

    this.Contract = await ethers.getContractFactory("AbArt");
    this.contract = await this.Contract.deploy();
    await this.contract.deployed();

    expect(await this.contract._tokenIds()).to.eq(0)
  });


  it("mint", async () => {
    const uri = 'caca';

    const tokenId = await this.contract._tokenIds();
    await this.contract.connect(this.signers[0]).mint(this.signers[0].address, uri);
    const newTokenId = await this.contract._tokenIds();

    expect(newTokenId).to.eq(tokenId.add(1));
    expect(await this.contract.ownerOf(tokenId)).to.eq(this.signers[0].address)
    expect(await this.contract.tokenURI(tokenId)).to.eq(uri)
  });
});
