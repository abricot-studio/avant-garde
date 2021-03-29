import networks from '../../contracts/deployments/networks.json'
import { Contract } from 'ethers'
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

export function getContract(providerOrSigner?: Signer | Provider) {
  const chainId = 4; // TODO
  const contractInfo = networks[chainId];
  if(!contractInfo) {
    throw new Error('unsupported network')
  }
  const { address, abi } = contractInfo
  return new Contract(address, abi, providerOrSigner)
}
