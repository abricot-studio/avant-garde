//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ArbArt is ERC721URIStorage, AccessControl {
  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

  string public baseURI;

  modifier onlyManager() { // Modifier
    require(
      hasRole(MANAGER_ROLE, msg.sender),
      "Only manager can call this."
    );
    _;
  }

  constructor(string memory _newBaseURI) ERC721("ArbArt", "ARBT") {
    _setupRole(MANAGER_ROLE, msg.sender);
    _setBaseURI(_newBaseURI);
  }

  function setBaseURI(string memory _newBaseURI) external onlyManager returns (bool) {
    return _setBaseURI(_newBaseURI);
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

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
    return AccessControl.supportsInterface(interfaceId) || ERC721.supportsInterface(interfaceId);
  }
}
