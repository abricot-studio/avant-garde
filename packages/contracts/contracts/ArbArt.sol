//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ArbArt is ERC721URIStorage, AccessControlEnumerable {
  using ECDSA for bytes32;

  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

  modifier onlyManager() { // Modifier
    require(
      hasRole(MANAGER_ROLE, msg.sender),
      "Only MANAGER_ROLE can call this method"
    );
    _;
  }

  constructor() ERC721("ArbArt", "ARBT") {
    _setupRole(MANAGER_ROLE, msg.sender);
  }

  function _baseURI() internal override view returns (string memory) {
    return "ipfs://";
  }

  function mint(string memory _uri, address _signer, bytes memory _signature)
  public
  returns (uint256 _tokenId)
  {
    // Check signature and if signer is manager
    require(
      hasRole(MANAGER_ROLE, _signer),
      "Only accepting signatures from MANAGER_ROLE"
    );
    bytes memory _message = abi.encodePacked(_uri, msg.sender, _signer);
    address _recoveredAddress = keccak256(_message)
      .toEthSignedMessageHash()
      .recover(_signature);
    require(_signer == _recoveredAddress, "Invalid recovered address");

    // Mint token
    _tokenId = uint256(uint160(bytes20(msg.sender)));

    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);

    return _tokenId;
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControlEnumerable) returns (bool) {
    return AccessControlEnumerable.supportsInterface(interfaceId) || ERC721.supportsInterface(interfaceId);
  }
}
