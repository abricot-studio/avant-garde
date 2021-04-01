/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { ArbArt } from "../ArbArt";

export class ArbArt__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _manager: string,
    _feesReceiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ArbArt> {
    return super.deploy(
      _manager,
      _feesReceiver,
      overrides || {}
    ) as Promise<ArbArt>;
  }
  getDeployTransaction(
    _manager: string,
    _feesReceiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_manager, _feesReceiver, overrides || {});
  }
  attach(address: string): ArbArt {
    return super.attach(address) as ArbArt;
  }
  connect(signer: Signer): ArbArt__factory {
    return super.connect(signer) as ArbArt__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ArbArt {
    return new Contract(address, _abi, signerOrProvider) as ArbArt;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_manager",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_feesReceiver",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "burnPrice",
        type: "uint256",
      },
    ],
    name: "Burned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "mintPrice",
        type: "uint256",
      },
    ],
    name: "Minted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newFeesReceiver",
        type: "address",
      },
    ],
    name: "changeFeesReceiver",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newManager",
        type: "address",
      },
    ],
    name: "changeManager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentBurnPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentMintPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentMintWithFeesPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feesReceiver",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_current",
        type: "uint256",
      },
    ],
    name: "mintPriceFor",
    outputs: [
      {
        internalType: "uint256",
        name: "_currentPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fees",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_current",
        type: "uint256",
      },
    ],
    name: "mintWithFeesPriceFor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_current",
        type: "uint256",
      },
    ],
    name: "priceFor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620025d4380380620025d4833981016040819052620000349162000178565b6040805180820182526006815265105c98905c9d60d21b6020808301918252835180850190945260048452631054909560e21b9084015281519192916200007e91600091620000d2565b50805162000094906001906020840190620000d2565b5050600980546001600160a01b039485166001600160a01b03199182161790915560088054939094169216919091179091555060016007556200020c565b828054620000e090620001b6565b90600052602060002090601f0160209004810192826200010457600085556200014f565b82601f106200011f57805160ff19168380011785556200014f565b828001600101855582156200014f579182015b828111156200014f57825182559160200191906001019062000132565b506200015d92915062000161565b5090565b5b808211156200015d576000815560010162000162565b600080604083850312156200018b578182fd5b82516200019881620001f3565b6020840151909250620001ab81620001f3565b809150509250929050565b600181811c90821680620001cb57607f821691505b60208210811415620001ed57634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160a01b03811681146200020957600080fd5b50565b6123b8806200021c6000396000f3fe6080604052600436106101815760003560e01c806377119765116100d1578063a22cb4651161008a578063bca93cf511610064578063bca93cf514610461578063c87b56dd14610481578063e985e9c5146104a1578063f620c815146104ea57610181565b8063a22cb46514610401578063a3fbbaae14610421578063b88d4fde1461044157610181565b806377119765146103625780638d5555f2146103775780638def9f821461039757806395d89b41146103b757806399f7ab31146103cc5780639d1b464a146103ec57610181565b806331fd9fd11161013e5780634737576e116101185780634737576e146102e1578063481c6a75146103025780636352211e1461032257806370a082311461034257610181565b806331fd9fd11461028157806342842e0e146102a157806342966c68146102c157610181565b806301ffc9a7146101865780630561942a146101bb57806306fdde03146101e5578063081812fc14610207578063095ea7b31461023f57806323b872dd14610261575b600080fd5b34801561019257600080fd5b506101a66101a1366004611ed9565b6104ff565b60405190151581526020015b60405180910390f35b3480156101c757600080fd5b506101d0610553565b604080519283526020830191909152016101b2565b3480156101f157600080fd5b506101fa61056a565b6040516101b29190612065565b34801561021357600080fd5b50610227610222366004611f88565b6105fc565b6040516001600160a01b0390911681526020016101b2565b34801561024b57600080fd5b5061025f61025a366004611eb0565b610689565b005b34801561026d57600080fd5b5061025f61027c366004611dd5565b61079f565b34801561028d57600080fd5b506101a661029c366004611d89565b6107d0565b3480156102ad57600080fd5b5061025f6102bc366004611dd5565b610838565b3480156102cd57600080fd5b506101a66102dc366004611f88565b610853565b6102f46102ef366004611f11565b6108f9565b6040519081526020016101b2565b34801561030e57600080fd5b50600954610227906001600160a01b031681565b34801561032e57600080fd5b5061022761033d366004611f88565b610a8e565b34801561034e57600080fd5b506102f461035d366004611d89565b610b05565b34801561036e57600080fd5b506102f4610b8c565b34801561038357600080fd5b506102f4610392366004611f88565b610bab565b3480156103a357600080fd5b506102f46103b2366004611f88565b610bd7565b3480156103c357600080fd5b506101fa610bfc565b3480156103d857600080fd5b506101d06103e7366004611f88565b610c0b565b3480156103f857600080fd5b506102f4610c2b565b34801561040d57600080fd5b5061025f61041c366004611e76565b610c39565b34801561042d57600080fd5b506101a661043c366004611d89565b610d0b565b34801561044d57600080fd5b5061025f61045c366004611e10565b610d72565b34801561046d57600080fd5b50600854610227906001600160a01b031681565b34801561048d57600080fd5b506101fa61049c366004611f88565b610daa565b3480156104ad57600080fd5b506101a66104bc366004611da3565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b3480156104f657600080fd5b506102f4610f29565b60006001600160e01b031982166380ac58cd60e01b148061053057506001600160e01b03198216635b5e139f60e01b145b8061054b57506301ffc9a760e01b6001600160e01b03198316145b90505b919050565b6000806105626103e760075490565b915091509091565b606060008054610579906122c0565b80601f01602080910402602001604051908101604052809291908181526020018280546105a5906122c0565b80156105f25780601f106105c7576101008083540402835291602001916105f2565b820191906000526020600020905b8154815290600101906020018083116105d557829003601f168201915b5050505050905090565b600061060782610f37565b61066d5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b600061069482610a8e565b9050806001600160a01b0316836001600160a01b031614156107025760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610664565b336001600160a01b038216148061071e575061071e81336104bc565b6107905760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610664565b61079a8383610f54565b505050565b6107a93382610fc2565b6107c55760405162461bcd60e51b8152600401610664906120ca565b61079a8383836110a8565b6008546000906001600160a01b031633146108135760405162461bcd60e51b815260206004820152600360248201526227232960e91b6044820152606401610664565b50600880546001600160a01b0383166001600160a01b03199091161790556001919050565b61079a83838360405180602001604052806000815250610d72565b60003361085f83610a8e565b6001600160a01b03161461089a5760405162461bcd60e51b81526020600482015260026024820152614e4f60f01b6044820152606401610664565b6108a46007611248565b6108ad8261129f565b60006108b7610c2b565b90506108c333826112e2565b604051819084907fcec1bae6e024d929f2929f3478ce70f55f9c636c8ef7b5073a61d7c3a432451b90600090a350600192915050565b600080833360405160200161090f929190611fcc565b6040516020818303038152906040529050600061098a8461098484805190602001206040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b906113fb565b6009549091506001600160a01b038083169116146109cf5760405162461bcd60e51b81526020600482015260026024820152614e4d60f01b6044820152606401610664565b6000806109da610553565b90925090506109e9818361211b565b3414610a1c5760405162461bcd60e51b8152602060048201526002602482015261414960f01b6044820152606401610664565b610a2a600780546001019055565b339450610a378580611476565b610a418588611494565b600854610a57906001600160a01b0316826112e2565b604051349086907f8a9dcf4e150b1153011b29fec302d5be0c13e84fa8f56ab78587f778a32a90dd90600090a35050505092915050565b6000818152600260205260408120546001600160a01b03168061054b5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610664565b60006001600160a01b038216610b705760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610664565b506001600160a01b031660009081526003602052604090205490565b6000610ba66001610b9c60075490565b610392919061227d565b905090565b6000612710610bbb60028461218d565b610bcd90670de0b6b3a764000061225e565b61054b9190612133565b6000806000610be584610c0b565b9092509050610bf4818361211b565b949350505050565b606060018054610579906122c0565b600080610c1783610bab565b9150610c24600a83612133565b9050915091565b6000610ba661039260075490565b6001600160a01b038216331415610c925760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610664565b3360008181526005602090815260408083206001600160a01b0387168085529252909120805460ff1916841515179055906001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610cff911515815260200190565b60405180910390a35050565b6009546000906001600160a01b03163314610d4d5760405162461bcd60e51b81526020600482015260026024820152614e4d60f01b6044820152606401610664565b50600980546001600160a01b0383166001600160a01b03199091161790556001919050565b610d7c3383610fc2565b610d985760405162461bcd60e51b8152600401610664906120ca565b610da48484848461151f565b50505050565b6060610db582610f37565b610e1b5760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610664565b60008281526006602052604081208054610e34906122c0565b80601f0160208091040260200160405190810160405280929190818152602001828054610e60906122c0565b8015610ead5780601f10610e8257610100808354040283529160200191610ead565b820191906000526020600020905b815481529060010190602001808311610e9057829003601f168201915b505050505090506000610eda604080518082019091526007815266697066733a2f2f60c81b602082015290565b9050805160001415610eee5750905061054e565b815115610f20578082604051602001610f08929190612003565b6040516020818303038152906040529250505061054e565b610bf484611552565b6000610ba66103b260075490565b6000908152600260205260409020546001600160a01b0316151590565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610f8982610a8e565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000610fcd82610f37565b61102e5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610664565b600061103983610a8e565b9050806001600160a01b0316846001600160a01b031614806110745750836001600160a01b0316611069846105fc565b6001600160a01b0316145b80610bf457506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff16610bf4565b826001600160a01b03166110bb82610a8e565b6001600160a01b0316146111235760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610664565b6001600160a01b0382166111855760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610664565b611190600082610f54565b6001600160a01b03831660009081526003602052604081208054600192906111b990849061227d565b90915550506001600160a01b03821660009081526003602052604081208054600192906111e790849061211b565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b8054806112975760405162461bcd60e51b815260206004820152601b60248201527f436f756e7465723a2064656372656d656e74206f766572666c6f7700000000006044820152606401610664565b600019019055565b6112a881611639565b600081815260066020526040902080546112c1906122c0565b1590506112df5760008181526006602052604081206112df91611c08565b50565b804710156113325760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610664565b6000826001600160a01b03168260405160006040518083038185875af1925050503d806000811461137f576040519150601f19603f3d011682016040523d82523d6000602084013e611384565b606091505b505090508061079a5760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d617920686176652072657665727465640000000000006064820152608401610664565b6000815160411461144e5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610664565b60208201516040830151606084015160001a61146c868285856116d4565b9695505050505050565b61149082826040518060200160405280600081525061187d565b5050565b61149d82610f37565b6115005760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610664565b6000828152600660209081526040909120825161079a92840190611c44565b61152a8484846110a8565b611536848484846118b0565b610da45760405162461bcd60e51b815260040161066490612078565b606061155d82610f37565b6115c15760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610664565b60006115e7604080518082019091526007815266697066733a2f2f60c81b602082015290565b905060008151116116075760405180602001604052806000815250611632565b80611611846119ba565b604051602001611622929190612003565b6040516020818303038152906040525b9392505050565b600061164482610a8e565b9050611651600083610f54565b6001600160a01b038116600090815260036020526040812080546001929061167a90849061227d565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08211156117515760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610664565b8360ff16601b148061176657508360ff16601c145b6117bd5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610664565b6040805160008082526020820180845288905260ff871692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa158015611811573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166118745760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610664565b95945050505050565b6118878383611ad5565b61189460008484846118b0565b61079a5760405162461bcd60e51b815260040161066490612078565b60006001600160a01b0384163b156119b257604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906118f4903390899088908890600401612032565b602060405180830381600087803b15801561190e57600080fd5b505af192505050801561193e575060408051601f3d908101601f1916820190925261193b91810190611ef5565b60015b611998573d80801561196c576040519150601f19603f3d011682016040523d82523d6000602084013e611971565b606091505b5080516119905760405162461bcd60e51b815260040161066490612078565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610bf4565b506001610bf4565b6060816119df57506040805180820190915260018152600360fc1b602082015261054e565b8160005b8115611a0957806119f3816122fb565b9150611a029050600a83612133565b91506119e3565b60008167ffffffffffffffff811115611a3257634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611a5c576020820181803683370190505b5090505b8415610bf457611a7160018361227d565b9150611a7e600a86612316565b611a8990603061211b565b60f81b818381518110611aac57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350611ace600a86612133565b9450611a60565b6001600160a01b038216611b2b5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610664565b611b3481610f37565b15611b815760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610664565b6001600160a01b0382166000908152600360205260408120805460019290611baa90849061211b565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b508054611c14906122c0565b6000825580601f10611c2657506112df565b601f0160209004906000526020600020908101906112df9190611cc8565b828054611c50906122c0565b90600052602060002090601f016020900481019282611c725760008555611cb8565b82601f10611c8b57805160ff1916838001178555611cb8565b82800160010185558215611cb8579182015b82811115611cb8578251825591602001919060010190611c9d565b50611cc4929150611cc8565b5090565b5b80821115611cc45760008155600101611cc9565b600067ffffffffffffffff80841115611cf857611cf8612356565b604051601f8501601f19908116603f01168101908282118183101715611d2057611d20612356565b81604052809350858152868686011115611d3957600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b038116811461054e57600080fd5b600082601f830112611d7a578081fd5b61163283833560208501611cdd565b600060208284031215611d9a578081fd5b61163282611d53565b60008060408385031215611db5578081fd5b611dbe83611d53565b9150611dcc60208401611d53565b90509250929050565b600080600060608486031215611de9578081fd5b611df284611d53565b9250611e0060208501611d53565b9150604084013590509250925092565b60008060008060808587031215611e25578081fd5b611e2e85611d53565b9350611e3c60208601611d53565b925060408501359150606085013567ffffffffffffffff811115611e5e578182fd5b611e6a87828801611d6a565b91505092959194509250565b60008060408385031215611e88578182fd5b611e9183611d53565b915060208301358015158114611ea5578182fd5b809150509250929050565b60008060408385031215611ec2578182fd5b611ecb83611d53565b946020939093013593505050565b600060208284031215611eea578081fd5b81356116328161236c565b600060208284031215611f06578081fd5b81516116328161236c565b60008060408385031215611f23578182fd5b823567ffffffffffffffff80821115611f3a578384fd5b818501915085601f830112611f4d578384fd5b611f5c86833560208501611cdd565b93506020850135915080821115611f71578283fd5b50611f7e85828601611d6a565b9150509250929050565b600060208284031215611f99578081fd5b5035919050565b60008151808452611fb8816020860160208601612294565b601f01601f19169290920160200192915050565b60008351611fde818460208801612294565b60609390931b6bffffffffffffffffffffffff19169190920190815260140192915050565b60008351612015818460208801612294565b835190830190612029818360208801612294565b01949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061146c90830184611fa0565b6000602082526116326020830184611fa0565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6000821982111561212e5761212e61232a565b500190565b60008261214257612142612340565b500490565b80825b60018086116121595750612184565b81870482111561216b5761216b61232a565b8086161561217857918102915b9490941c93800261214a565b94509492505050565b600061163260001960ff8516846000826121a957506001611632565b816121b657506000611632565b81600181146121cc57600281146121d657612203565b6001915050611632565b60ff8411156121e7576121e761232a565b6001841b9150848211156121fd576121fd61232a565b50611632565b5060208310610133831016604e8410600b8410161715612236575081810a838111156122315761223161232a565b611632565b6122438484846001612147565b8086048211156122555761225561232a565b02949350505050565b60008160001904831182151516156122785761227861232a565b500290565b60008282101561228f5761228f61232a565b500390565b60005b838110156122af578181015183820152602001612297565b83811115610da45750506000910152565b600181811c908216806122d457607f821691505b602082108114156122f557634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561230f5761230f61232a565b5060010190565b60008261232557612325612340565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b0319811681146112df57600080fdfea2646970667358221220b3b1e9840ccb60e15ae3e29521b5d0e1cadcc2fea924d0458d2f99ee4e09110e64736f6c63430008030033";
