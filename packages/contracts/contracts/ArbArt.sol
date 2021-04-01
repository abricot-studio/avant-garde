//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArbArt is ERC721URIStorage {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;
  using Address for address payable;

  event Minted(uint256 indexed tokenId, uint256 indexed mintPrice);
  event Burned(uint256 indexed tokenId, uint256 indexed burnPrice);

  Counters.Counter countMint;

  uint8 constant fees = 10; // 10%
  address payable public feesReceiver;
  address public manager;

  constructor(address _manager, address payable _feesReceiver) ERC721("ArbArt", "ARBT") {
    manager = _manager;
    feesReceiver = _feesReceiver;
    countMint._value = 1;
  }

  function changeFeesReceiver(address _newFeesReceiver) public returns (bool){

    require(msg.sender == feesReceiver, "NFR");
    feesReceiver = payable(_newFeesReceiver);
    return true;

  }

  function changeManager(address _newManager) public returns (bool){

    require(msg.sender == manager, "NM");
    manager = _newManager;
    return true;

  }

  function _baseURI() internal override pure returns (string memory) {
    return "ipfs://";
  }

  function mint(string memory _uri, bytes memory _signature) public payable returns (uint256 _tokenId) {

    bytes memory _message = abi.encodePacked(_uri, msg.sender);
    address _recoveredAddress = keccak256(_message).toEthSignedMessageHash().recover(_signature);
    require(manager == _recoveredAddress, "NM");

    // Check price
    (uint256 price, uint256 mintFees) = currentMintPrice();
    require(msg.value == price + mintFees, "AI");
    countMint.increment();

    // Mint token
    _tokenId = uint256(uint160(bytes20(msg.sender)));
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);
    feesReceiver.sendValue(mintFees);

    emit Minted(_tokenId, msg.value);
    return _tokenId;

  }

  function burn(uint256 _tokenId) public returns (bool){

    require(ownerOf(_tokenId) == msg.sender, "NO");

    countMint.decrement();
    _burn(_tokenId);
    uint256 burnPrice = currentPrice();
    payable(msg.sender).sendValue(burnPrice);

    emit Burned(_tokenId, burnPrice);

    return true;

  }

  // Price
  function currentPrice() public view returns (uint256){
    return priceFor(countMint.current() );
  }

  function currentMintPrice() public view returns (uint256, uint256){
    return mintPriceFor(countMint.current() );
  }

  function currentBurnPrice() public view returns (uint256){
    return priceFor(countMint.current() - 1);
  }

  function currentMintWithFeesPrice() public view returns (uint256){
    return mintWithFeesPriceFor(countMint.current() );
  }

  function mintWithFeesPriceFor(uint256 _current) public pure returns (uint256){
    (uint256 mintPrice, uint256 mintFees) = mintPriceFor(_current);
    return mintPrice + mintFees;
  }

  function mintPriceFor(uint256 _current) public pure returns (uint256 _currentPrice, uint256 _fees){
    _currentPrice = priceFor(_current);
    _fees = _currentPrice / fees;
  }

  function priceFor(uint256 _current) public pure returns (uint256){
    return _current ** 2 * (10 ** 18) / 10000; // x^2 / 10000
  }

}
