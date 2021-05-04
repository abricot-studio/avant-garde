/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { AvantGarde } from "../AvantGarde";

export class AvantGarde__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _manager: string,
    _feesReceiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AvantGarde> {
    return super.deploy(
      _manager,
      _feesReceiver,
      overrides || {}
    ) as Promise<AvantGarde>;
  }
  getDeployTransaction(
    _manager: string,
    _feesReceiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_manager, _feesReceiver, overrides || {});
  }
  attach(address: string): AvantGarde {
    return super.attach(address) as AvantGarde;
  }
  connect(signer: Signer): AvantGarde__factory {
    return super.connect(signer) as AvantGarde__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AvantGarde {
    return new Contract(address, _abi, signerOrProvider) as AvantGarde;
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
    name: "countMint",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
  "0x60806040523480156200001157600080fd5b506040516200261f3803806200261f833981016040819052620000349162000176565b604080518082018252600a8152694176616e74476172646560b01b60208083019182528351808501909452600384526241564760e81b9084015281519192916200008191600091620000d0565b50805162000097906001906020840190620000d0565b5050600980546001600160a01b039485166001600160a01b0319918216179091556008805493909416921691909117909155506200020a565b828054620000de90620001b4565b90600052602060002090601f0160209004810192826200010257600085556200014d565b82601f106200011d57805160ff19168380011785556200014d565b828001600101855582156200014d579182015b828111156200014d57825182559160200191906001019062000130565b506200015b9291506200015f565b5090565b5b808211156200015b576000815560010162000160565b6000806040838503121562000189578182fd5b82516200019681620001f1565b6020840151909250620001a981620001f1565b809150509250929050565b600181811c90821680620001c957607f821691505b60208210811415620001eb57634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160a01b03811681146200020757600080fd5b50565b612405806200021a6000396000f3fe60806040526004361061019c5760003560e01c806377119765116100ec578063a22cb4651161008a578063bca93cf511610064578063bca93cf514610493578063c87b56dd146104b3578063e985e9c5146104d3578063f620c8151461051c57600080fd5b8063a22cb46514610433578063a3fbbaae14610453578063b88d4fde1461047357600080fd5b80638def9f82116100c65780638def9f82146103c957806395d89b41146103e957806399f7ab31146103fe5780639d1b464a1461041e57600080fd5b8063771197651461037d5780637e309aaa146103925780638d5555f2146103a957600080fd5b806331fd9fd1116101595780634737576e116101335780634737576e146102fc578063481c6a751461031d5780636352211e1461033d57806370a082311461035d57600080fd5b806331fd9fd11461029c57806342842e0e146102bc57806342966c68146102dc57600080fd5b806301ffc9a7146101a15780630561942a146101d657806306fdde0314610200578063081812fc14610222578063095ea7b31461025a57806323b872dd1461027c575b600080fd5b3480156101ad57600080fd5b506101c16101bc366004611f4f565b610531565b60405190151581526020015b60405180910390f35b3480156101e257600080fd5b506101eb610583565b604080519283526020830191909152016101cd565b34801561020c57600080fd5b506102156105a5565b6040516101cd91906120db565b34801561022e57600080fd5b5061024261023d366004611ffe565b610637565b6040516001600160a01b0390911681526020016101cd565b34801561026657600080fd5b5061027a610275366004611f26565b6106c4565b005b34801561028857600080fd5b5061027a610297366004611e4b565b6107da565b3480156102a857600080fd5b506101c16102b7366004611dff565b61080b565b3480156102c857600080fd5b5061027a6102d7366004611e4b565b610874565b3480156102e857600080fd5b506101c16102f7366004611ffe565b61088f565b61030f61030a366004611f87565b610935565b6040519081526020016101cd565b34801561032957600080fd5b50600954610242906001600160a01b031681565b34801561034957600080fd5b50610242610358366004611ffe565b610aca565b34801561036957600080fd5b5061030f610378366004611dff565b610b41565b34801561038957600080fd5b5061030f610bc8565b34801561039e57600080fd5b5060075461030f9081565b3480156103b557600080fd5b5061030f6103c4366004611ffe565b610bdb565b3480156103d557600080fd5b5061030f6103e4366004611ffe565b610c07565b3480156103f557600080fd5b50610215610c2c565b34801561040a57600080fd5b506101eb610419366004611ffe565b610c3b565b34801561042a57600080fd5b5061030f610c5b565b34801561043f57600080fd5b5061027a61044e366004611eec565b610c74565b34801561045f57600080fd5b506101c161046e366004611dff565b610d39565b34801561047f57600080fd5b5061027a61048e366004611e86565b610da1565b34801561049f57600080fd5b50600854610242906001600160a01b031681565b3480156104bf57600080fd5b506102156104ce366004611ffe565b610dd9565b3480156104df57600080fd5b506101c16104ee366004611e19565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b34801561052857600080fd5b5061030f610f57565b60006001600160e01b031982166380ac58cd60e01b148061056257506001600160e01b03198216635b5e139f60e01b145b8061057d57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60008061059d61059260075490565b610419906001612191565b915091509091565b6060600080546105b49061230d565b80601f01602080910402602001604051908101604052809291908181526020018280546105e09061230d565b801561062d5780601f106106025761010080835404028352916020019161062d565b820191906000526020600020905b81548152906001019060200180831161061057829003601f168201915b5050505050905090565b600061064282610f70565b6106a85760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006106cf82610aca565b9050806001600160a01b0316836001600160a01b0316141561073d5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b606482015260840161069f565b336001600160a01b0382161480610759575061075981336104ee565b6107cb5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000606482015260840161069f565b6107d58383610f8d565b505050565b6107e43382610ffb565b6108005760405162461bcd60e51b815260040161069f90612140565b6107d58383836110e1565b6008546000906001600160a01b0316331461084e5760405162461bcd60e51b815260206004820152600360248201526227232960e91b604482015260640161069f565b50600880546001600160a01b0319166001600160a01b0392909216919091179055600190565b6107d583838360405180602001604052806000815250610da1565b60003361089b83610aca565b6001600160a01b0316146108d65760405162461bcd60e51b81526020600482015260026024820152614e4f60f01b604482015260640161069f565b6108e06007611281565b6108e9826112d8565b60006108f3610c5b565b90506108ff338261131b565b604051819084907fcec1bae6e024d929f2929f3478ce70f55f9c636c8ef7b5073a61d7c3a432451b90600090a350600192915050565b600080833360405160200161094b929190612042565b604051602081830303815290604052905060006109c6846109c084805190602001206040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b90611434565b6009549091506001600160a01b03808316911614610a0b5760405162461bcd60e51b81526020600482015260026024820152614e4d60f01b604482015260640161069f565b600080610a16610583565b9092509050610a258183612191565b3414610a585760405162461bcd60e51b8152602060048201526002602482015261414960f01b604482015260640161069f565b610a66600780546001019055565b339450610a7385806114ea565b610a7d8588611508565b600854610a93906001600160a01b03168261131b565b604051349086907f8a9dcf4e150b1153011b29fec302d5be0c13e84fa8f56ab78587f778a32a90dd90600090a35050505092915050565b6000818152600260205260408120546001600160a01b03168061057d5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b606482015260840161069f565b60006001600160a01b038216610bac5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b606482015260840161069f565b506001600160a01b031660009081526003602052604090205490565b6000610bd66103c460075490565b905090565b6000612710610beb600284612200565b610bfd90670de0b6b3a76400006122ab565b61057d91906121a9565b6000806000610c1584610c3b565b9092509050610c248183612191565b949350505050565b6060600180546105b49061230d565b600080610c4783610bdb565b9150610c54600a836121a9565b9050915091565b6000610bd6610c6960075490565b6103c4906001612191565b6001600160a01b038216331415610ccd5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015260640161069f565b3360008181526005602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6009546000906001600160a01b03163314610d7b5760405162461bcd60e51b81526020600482015260026024820152614e4d60f01b604482015260640161069f565b50600980546001600160a01b0319166001600160a01b0392909216919091179055600190565b610dab3383610ffb565b610dc75760405162461bcd60e51b815260040161069f90612140565b610dd384848484611593565b50505050565b6060610de482610f70565b610e4a5760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b606482015260840161069f565b60008281526006602052604081208054610e639061230d565b80601f0160208091040260200160405190810160405280929190818152602001828054610e8f9061230d565b8015610edc5780601f10610eb157610100808354040283529160200191610edc565b820191906000526020600020905b815481529060010190602001808311610ebf57829003601f168201915b505050505090506000610f09604080518082019091526007815266697066733a2f2f60c81b602082015290565b9050805160001415610f1c575092915050565b815115610f4e578082604051602001610f36929190612079565b60405160208183030381529060405292505050919050565b610c24846115c6565b6000610bd6610f6560075490565b6103e4906001612191565b6000908152600260205260409020546001600160a01b0316151590565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610fc282610aca565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600061100682610f70565b6110675760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b606482015260840161069f565b600061107283610aca565b9050806001600160a01b0316846001600160a01b031614806110ad5750836001600160a01b03166110a284610637565b6001600160a01b0316145b80610c2457506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff16610c24565b826001600160a01b03166110f482610aca565b6001600160a01b03161461115c5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b606482015260840161069f565b6001600160a01b0382166111be5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b606482015260840161069f565b6111c9600082610f8d565b6001600160a01b03831660009081526003602052604081208054600192906111f29084906122ca565b90915550506001600160a01b0382166000908152600360205260408120805460019290611220908490612191565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b8054806112d05760405162461bcd60e51b815260206004820152601b60248201527f436f756e7465723a2064656372656d656e74206f766572666c6f770000000000604482015260640161069f565b600019019055565b6112e1816116ad565b600081815260066020526040902080546112fa9061230d565b15905061131857600081815260066020526040812061131891611c7b565b50565b8047101561136b5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e6365000000604482015260640161069f565b6000826001600160a01b03168260405160006040518083038185875af1925050503d80600081146113b8576040519150601f19603f3d011682016040523d82523d6000602084013e6113bd565b606091505b50509050806107d55760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d61792068617665207265766572746564000000000000606482015260840161069f565b60008060008084516041141561145e5750505060208201516040830151606084015160001a6114d4565b84516040141561148c5750505060408201516020830151906001600160ff1b0381169060ff1c601b016114d4565b60405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161069f565b6114e086828585611748565b9695505050505050565b6115048282604051806020016040528060008152506118f1565b5050565b61151182610f70565b6115745760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b606482015260840161069f565b600082815260066020908152604090912082516107d592840190611cb5565b61159e8484846110e1565b6115aa84848484611924565b610dd35760405162461bcd60e51b815260040161069f906120ee565b60606115d182610f70565b6116355760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b606482015260840161069f565b600061165b604080518082019091526007815266697066733a2f2f60c81b602082015290565b9050600081511161167b57604051806020016040528060008152506116a6565b8061168584611a2e565b604051602001611696929190612079565b6040516020818303038152906040525b9392505050565b60006116b882610aca565b90506116c5600083610f8d565b6001600160a01b03811660009081526003602052604081208054600192906116ee9084906122ca565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08211156117c55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161069f565b8360ff16601b14806117da57508360ff16601c145b6118315760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b606482015260840161069f565b6040805160008082526020820180845288905260ff871692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa158015611885573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166118e85760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161069f565b95945050505050565b6118fb8383611b48565b6119086000848484611924565b6107d55760405162461bcd60e51b815260040161069f906120ee565b60006001600160a01b0384163b15611a2657604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906119689033908990889088906004016120a8565b602060405180830381600087803b15801561198257600080fd5b505af19250505080156119b2575060408051601f3d908101601f191682019092526119af91810190611f6b565b60015b611a0c573d8080156119e0576040519150601f19603f3d011682016040523d82523d6000602084013e6119e5565b606091505b508051611a045760405162461bcd60e51b815260040161069f906120ee565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610c24565b506001610c24565b606081611a525750506040805180820190915260018152600360fc1b602082015290565b8160005b8115611a7c5780611a6681612348565b9150611a759050600a836121a9565b9150611a56565b60008167ffffffffffffffff811115611aa557634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611acf576020820181803683370190505b5090505b8415610c2457611ae46001836122ca565b9150611af1600a86612363565b611afc906030612191565b60f81b818381518110611b1f57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350611b41600a866121a9565b9450611ad3565b6001600160a01b038216611b9e5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015260640161069f565b611ba781610f70565b15611bf45760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640161069f565b6001600160a01b0382166000908152600360205260408120805460019290611c1d908490612191565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b508054611c879061230d565b6000825580601f10611c97575050565b601f0160209004906000526020600020908101906113189190611d39565b828054611cc19061230d565b90600052602060002090601f016020900481019282611ce35760008555611d29565b82601f10611cfc57805160ff1916838001178555611d29565b82800160010185558215611d29579182015b82811115611d29578251825591602001919060010190611d0e565b50611d35929150611d39565b5090565b5b80821115611d355760008155600101611d3a565b600067ffffffffffffffff80841115611d6957611d696123a3565b604051601f8501601f19908116603f01168101908282118183101715611d9157611d916123a3565b81604052809350858152868686011115611daa57600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b0381168114611ddb57600080fd5b919050565b600082601f830112611df0578081fd5b6116a683833560208501611d4e565b600060208284031215611e10578081fd5b6116a682611dc4565b60008060408385031215611e2b578081fd5b611e3483611dc4565b9150611e4260208401611dc4565b90509250929050565b600080600060608486031215611e5f578081fd5b611e6884611dc4565b9250611e7660208501611dc4565b9150604084013590509250925092565b60008060008060808587031215611e9b578081fd5b611ea485611dc4565b9350611eb260208601611dc4565b925060408501359150606085013567ffffffffffffffff811115611ed4578182fd5b611ee087828801611de0565b91505092959194509250565b60008060408385031215611efe578182fd5b611f0783611dc4565b915060208301358015158114611f1b578182fd5b809150509250929050565b60008060408385031215611f38578182fd5b611f4183611dc4565b946020939093013593505050565b600060208284031215611f60578081fd5b81356116a6816123b9565b600060208284031215611f7c578081fd5b81516116a6816123b9565b60008060408385031215611f99578182fd5b823567ffffffffffffffff80821115611fb0578384fd5b818501915085601f830112611fc3578384fd5b611fd286833560208501611d4e565b93506020850135915080821115611fe7578283fd5b50611ff485828601611de0565b9150509250929050565b60006020828403121561200f578081fd5b5035919050565b6000815180845261202e8160208601602086016122e1565b601f01601f19169290920160200192915050565b600083516120548184602088016122e1565b60609390931b6bffffffffffffffffffffffff19169190920190815260140192915050565b6000835161208b8184602088016122e1565b83519083019061209f8183602088016122e1565b01949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906114e090830184612016565b6020815260006116a66020830184612016565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b600082198211156121a4576121a4612377565b500190565b6000826121b8576121b861238d565b500490565b600181815b808511156121f85781600019048211156121de576121de612377565b808516156121eb57918102915b93841c93908002906121c2565b509250929050565b60006116a660ff8416836000826122195750600161057d565b816122265750600061057d565b816001811461223c576002811461224657612262565b600191505061057d565b60ff84111561225757612257612377565b50506001821b61057d565b5060208310610133831016604e8410600b8410161715612285575081810a61057d565b61228f83836121bd565b80600019048211156122a3576122a3612377565b029392505050565b60008160001904831182151516156122c5576122c5612377565b500290565b6000828210156122dc576122dc612377565b500390565b60005b838110156122fc5781810151838201526020016122e4565b83811115610dd35750506000910152565b600181811c9082168061232157607f821691505b6020821081141561234257634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561235c5761235c612377565b5060010190565b6000826123725761237261238d565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461131857600080fdfea26469706673582212206ca390cc5b273d7b757ba274cc938264185572b68e58f613d6ed83618e5d277b64736f6c63430008040033";
