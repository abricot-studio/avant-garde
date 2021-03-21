import { ethers } from 'hardhat'

const { expect } = require('chai')

const { MANAGER_ROLE, signMintingRequest } = require('../lib/ArbArt')

const memory: any = {}

const tokenURI = (uri) => `ipfs://${uri}`

describe('ArbArt', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
    memory.Contract = await ethers.getContractFactory('ArbArt')
  })

  beforeEach(async () => {

    memory.manager = memory.signers[0]
    memory.feesReceiver = memory.signers[memory.signers.length - 1]
    memory.other = memory.signers[1]
    memory.other2 = memory.signers[2]
    memory.contract = await memory.Contract.deploy(memory.feesReceiver.address)
    await memory.contract.deployed()

  })

  it('sets up the contract', async () => {
    expect(await memory.contract.name()).to.eq('ArbArt')
    expect(await memory.contract.symbol()).to.eq('ARBT')
    expect(await memory.contract.hasRole(MANAGER_ROLE, memory.manager.address))
      .to.be.true
    expect(await memory.contract.hasRole(MANAGER_ROLE, memory.other.address)).to
      .be.false
  })

  it('priceFor', async () => {

    // console.log('1', ethers.utils.formatEther(await memory.contract.priceFor('1') ));
    // console.log('10', ethers.utils.formatEther(await memory.contract.priceFor('10') ));
    // console.log('100', ethers.utils.formatEther(await memory.contract.priceFor('100') ));
    // console.log('500', ethers.utils.formatEther(await memory.contract.priceFor('500') ));
    // console.log('1000', ethers.utils.formatEther(await memory.contract.priceFor('1000') ));
    // console.log('5000', ethers.utils.formatEther(await memory.contract.priceFor('5000') ));
    // console.log('10000', ethers.utils.formatEther(await memory.contract.priceFor('10000') ));

    expect(await memory.contract.priceFor('1') ).to.eq(ethers.utils.parseEther('0.0001') );
    expect(await memory.contract.priceFor('10') ).to.eq(ethers.utils.parseEther('0.01') );
    expect(await memory.contract.priceFor('100') ).to.eq(ethers.utils.parseEther('1') );
    expect(await memory.contract.priceFor('500') ).to.eq(ethers.utils.parseEther('25') );
    expect(await memory.contract.priceFor('1000') ).to.eq(ethers.utils.parseEther('100') );
    expect(await memory.contract.priceFor('5000') ).to.eq(ethers.utils.parseEther('2500') );
    expect(await memory.contract.priceFor('10000') ).to.eq(ethers.utils.parseEther('10000') );

  });

  it('mintWithFeesPriceFor', async () => {

    // console.log('1', ethers.utils.formatEther(await memory.contract.mintWithFeesPriceFor('1') ));
    // console.log('10', ethers.utils.formatEther(await memory.contract.mintWithFeesPriceFor('10') ));
    // console.log('100', ethers.utils.formatEther(await memory.contract.mintWithFeesPriceFor('100') ));
    // console.log('500', ethers.utils.formatEther(await memory.contract.mintWithFeesPriceFor('500') ));
    // console.log('1000', ethers.utils.formatEther(await memory.contract.mintWithFeesPriceFor('1000') ));
    // console.log('5000', ethers.utils.formatEther(await memory.contract.mintWithFeesPriceFor('5000') ));
    // console.log('10000', ethers.utils.formatEther(await memory.contract.mintWithFeesPriceFor('10000') ));

    expect(await memory.contract.mintWithFeesPriceFor('1') ).to.eq(ethers.utils.parseEther('0.00011') );
    expect(await memory.contract.mintWithFeesPriceFor('10') ).to.eq(ethers.utils.parseEther('0.011') );
    expect(await memory.contract.mintWithFeesPriceFor('100') ).to.eq(ethers.utils.parseEther('1.1') );
    expect(await memory.contract.mintWithFeesPriceFor('500') ).to.eq(ethers.utils.parseEther('27.5') );
    expect(await memory.contract.mintWithFeesPriceFor('1000') ).to.eq(ethers.utils.parseEther('110') );
    expect(await memory.contract.mintWithFeesPriceFor('5000') ).to.eq(ethers.utils.parseEther('2750') );
    expect(await memory.contract.mintWithFeesPriceFor('10000') ).to.eq(ethers.utils.parseEther('11000') );

  });

  it('mint', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const signature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.manager
    )
    const feesReceiverOriginalBalance = await ethers.provider.getBalance(memory.feesReceiver.address)
    const minterOriginalBalance = await ethers.provider.getBalance(memory.other.address)
    const mintWithFeesPrice = await memory.contract.currentMintWithFeesPrice()
    expect(mintWithFeesPrice).to.eq(ethers.utils.parseEther('0.00011') )

    const txMint = await memory.contract
      .connect(memory.other)
      .mint(uri, memory.manager.address, signature, {
        value: mintWithFeesPrice
      })
    const receiptMint = await txMint.wait();
    const feesMintInEth = txMint.gasPrice.mul(receiptMint.gasUsed)

    const tokenId = memory.other.address
    expect(await memory.contract.ownerOf(tokenId)).to.eq(memory.other.address)
    expect(await memory.contract.tokenURI(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.currentMintWithFeesPrice()).to.eq(ethers.utils.parseEther('0.00044') )
    expect(await ethers.provider.getBalance(memory.contract.address) ).to.eq(ethers.utils.parseEther('0.0001') )
    expect(await ethers.provider.getBalance(memory.feesReceiver.address) )
      .to.eq(feesReceiverOriginalBalance.add(ethers.utils.parseEther('0.00001') ) )
    expect(await ethers.provider.getBalance(memory.other.address) )
      .to.eq(minterOriginalBalance.sub(feesMintInEth).sub(ethers.utils.parseEther('0.00011') ) )

  })

  it("can't mint two times", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const signature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.manager
    )
    const mintWithFeesPrice = await memory.contract.currentMintWithFeesPrice()
    await memory.contract
      .connect(memory.other)
      .mint(uri, memory.manager.address, signature, {
        value: mintWithFeesPrice
      })

    const mintWithFeesPrice1 = await memory.contract.currentMintWithFeesPrice()
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, memory.manager.address, signature, {
          value: mintWithFeesPrice1
        })
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

  it("can't mint with wrong value", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const signature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, memory.manager.address, signature, {
          value: '123'
        })
    ).to.be.revertedWith('ArbArt: amount invalid')
  })

  it('mint and burn', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const signature = await signMintingRequest(
      uri,
      memory.other.address,
      memory.manager
    )
    const mintWithFeesPrice = await memory.contract.currentMintWithFeesPrice()
    expect(mintWithFeesPrice).to.eq(ethers.utils.parseEther('0.00011') )

    await memory.contract
      .connect(memory.other)
      .mint(uri, memory.manager.address, signature, {
        value: mintWithFeesPrice
      })

    const tokenId = memory.other.address
    const minterOriginalBalance = await ethers.provider.getBalance(memory.other.address)

    const tx = await memory.contract
      .connect(memory.other)
      .burn(tokenId)

    const receipt = await tx.wait();
    const feesInEth = tx.gasPrice.mul(receipt.gasUsed)

    await expect(memory.contract.tokenURI(tokenId)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token')
    expect(await ethers.provider.getBalance(memory.contract.address) ).to.eq(ethers.utils.parseEther('0') )
    expect(await ethers.provider.getBalance(memory.other.address) )
      .to.eq(minterOriginalBalance.sub(feesInEth).add(ethers.utils.parseEther('0.0001') ) )

  })

  it('mint and burn multiple', async () => {

    const feesReceiverOriginalBalance = await ethers.provider.getBalance(memory.feesReceiver.address)

    // mint w1
    const uri1 = 'Qmsfzefi221ifjzifj'
    const signature1 = await signMintingRequest(
      uri1,
      memory.other.address,
      memory.manager
    )
    const mintWithFeesPrice1 = await memory.contract.currentMintWithFeesPrice()
    expect(mintWithFeesPrice1).to.eq(ethers.utils.parseEther('0.00011') )
    const tokenId1 = memory.other.address
    await memory.contract
      .connect(memory.other)
      .mint(uri1, memory.manager.address, signature1, {
        value: mintWithFeesPrice1
      })


    // mint w2
    const uri2 = 'Qmsfzefi221ifjzifj2'
    const signature2 = await signMintingRequest(
      uri2,
      memory.other2.address,
      memory.manager
    )
    const mintWithFeesPrice2 = await memory.contract.currentMintWithFeesPrice()
    expect(mintWithFeesPrice2).to.eq(ethers.utils.parseEther('0.00044') )
    const tokenId2 = memory.other2.address
    await memory.contract
      .connect(memory.other2)
      .mint(uri2, memory.manager.address, signature2, {
        value: mintWithFeesPrice2
      })

    expect(await ethers.provider.getBalance(memory.contract.address) ).to.eq(ethers.utils.parseEther('0.0001').add(ethers.utils.parseEther('0.0004') ) )
    const mintWithFeesPriceEndMint = await memory.contract.currentMintWithFeesPrice()
    expect(mintWithFeesPriceEndMint).to.eq(ethers.utils.parseEther('0.00099') )

    // burn w1
    const minterOriginal1Balance = await ethers.provider.getBalance(memory.other.address)

    const txBurn1 = await memory.contract
      .connect(memory.other)
      .burn(tokenId1)

    const receipt1 = await txBurn1.wait();
    const feesInEth1 = txBurn1.gasPrice.mul(receipt1.gasUsed)

    // burn w2

    const minterOriginal2Balance = await ethers.provider.getBalance(memory.other2.address)

    const txBurn2 = await memory.contract
      .connect(memory.other2)
      .burn(tokenId2)

    const receipt2 = await txBurn2.wait();
    const feesInEth2 = txBurn2.gasPrice.mul(receipt2.gasUsed)

    expect(await ethers.provider.getBalance(memory.contract.address) ).to.eq(ethers.utils.parseEther('0') )
    expect(await memory.contract.currentMintWithFeesPrice() ).to.eq(mintWithFeesPrice1)
    expect(await ethers.provider.getBalance(memory.feesReceiver.address) )
      .to.eq(feesReceiverOriginalBalance
      .add(ethers.utils.parseEther('0.00004') )
      .add(ethers.utils.parseEther('0.00001') ) )

    // w1
    expect(await ethers.provider.getBalance(memory.other.address) )
      .to.eq(minterOriginal1Balance.sub(feesInEth1).add(ethers.utils.parseEther('0.0004') ) )

    // w2
    expect(await ethers.provider.getBalance(memory.other2.address) )
      .to.eq(minterOriginal2Balance.sub(feesInEth2).add(ethers.utils.parseEther('0.0001') ) )

  })

})
