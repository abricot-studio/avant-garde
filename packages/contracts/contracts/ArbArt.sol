//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArbArt is ERC721URIStorage, AccessControl {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;
  using Address for address payable;

  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
  Counters.Counter countMint;

  uint256 fees = 10; // 10%
  uint256 baseFees = 100;
  address payable feesReceiver;

  //  modifier onlyManager() { // Modifier
  //    require(
  //      hasRole(MANAGER_ROLE, msg.sender),
  //      "Only MANAGER_ROLE can call this method"
  //    );
  //    _;
  //  }

  constructor(address _manager, address payable _feesReceiver) ERC721("ArbArt", "ARBT") {
    _setupRole(MANAGER_ROLE, _manager);
    feesReceiver = _feesReceiver;
    countMint._value = 1;
  }

  function _baseURI() internal override pure returns (string memory) {
    return "ipfs://";
  }

  function mint(string memory _uri, address _signer, bytes memory _signature) public payable returns (uint256 _tokenId) {

    // Check signature and if signer is manager
    require(
      hasRole(MANAGER_ROLE, _signer),
      "Only accepting signatures from MANAGER_ROLE"
    );
    bytes memory _message = abi.encodePacked(_uri, msg.sender, _signer);
    address _recoveredAddress = keccak256(_message).toEthSignedMessageHash().recover(_signature);
    require(_signer == _recoveredAddress, "Invalid recovered address");

    // Check price
    (uint256 price, uint256 mintFees) = currentMintPrice();
    require(msg.value == price + mintFees, "ArbArt: amount invalid");
    countMint.increment();

    // Mint token
    _tokenId = uint256(uint160(bytes20(msg.sender)));
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);
    feesReceiver.sendValue(mintFees);

    return _tokenId;

  }

  function burn(uint256 _tokenId) public returns (bool){

    require(ownerOf(_tokenId) == msg.sender, "ArbArt: not owner");

    countMint.decrement();
    _burn(_tokenId);
    payable(msg.sender).sendValue(currentPrice() );

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

  function mintWithFeesPriceFor(uint256 _current) public view returns (uint256){
    (uint256 mintPrice, uint256 mintFees) = mintPriceFor(_current);
    return mintPrice + mintFees;
  }

  function mintPriceFor(uint256 _current) public view returns (uint256 _currentPrice, uint256 _fees){
    _currentPrice = priceFor(_current);
    _fees = _currentPrice * fees / baseFees;
  }

  function priceFor(uint256 _current) public view returns (uint256){
    return _current ** 2 * (10 ** 18) / 10000; // x^2 / 10000
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
    return AccessControl.supportsInterface(interfaceId) || ERC721.supportsInterface(interfaceId);
  }

}
