//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/access/AccessControl.sol";

contract ArbArt is ERC721URIStorage {

  string public baseURI;

  constructor(string memory _newBaseURI) ERC721("ArbArt", "ARBT") {
    _setBaseURI(_newBaseURI);
  }

  function _setBaseURI(string memory _newBaseURI) internal returns (bool) {
    baseURI = _newBaseURI;
    return true;
  }

  function _baseURI() internal override view returns (string memory) {
    return baseURI;
  }

  function mint(string memory _uri)
  public
  returns (uint256 _tokenId)
  {
    _tokenId = uint256(uint160(bytes20(msg.sender)));

    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);

    return _tokenId;
  }
}
