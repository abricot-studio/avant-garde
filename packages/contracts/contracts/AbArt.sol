//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AbArt is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public _tokenIds;


  constructor() ERC721("AbArt", "AART") {
  }

  function mint(address dst, string memory uri)
  public
  returns (uint256)
  {
    uint256 itemId = _tokenIds.current();
    _safeMint(dst, itemId);
    _setTokenURI(itemId, uri);
    _tokenIds.increment();

    return itemId;
  }
}
