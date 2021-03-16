//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ArbArt is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public tokenIds;
  mapping (address => uint256) public tokenIdOfAddress;
  mapping (uint256 => address) public addressOfTokenId;

  constructor() ERC721("ArbArt", "ARBT") {
  }

  function mint(string memory _uri)
  public
  returns (uint256 _tokenId)
  {

    require(tokenIdOfAddress[msg.sender] == 0, "Already minted token for this address");

    tokenIds.increment();
    _tokenId = tokenIds.current();

    //_safeMint(msg.sender, uint256(_tokenId));
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);

    tokenIdOfAddress[msg.sender] = _tokenId;
    addressOfTokenId[_tokenId] = msg.sender;

    return _tokenId;
  }
}
