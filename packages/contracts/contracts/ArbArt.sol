//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/access/AccessControl.sol";

contract ArbArt is ERC721URIStorage {
  constructor() ERC721("ArbArt", "ARBT") {
  }

  function mint(string memory _uri)
  public
  returns (uint256 _tokenId)
  {

    _tokenId = uint256(uint160(bytes20(msg.sender)));
    require(!_exists(_tokenId), "ArbArt: Already minted token for this address");

    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);

    return _tokenId;
  }
}
