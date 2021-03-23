import networks from '../../contracts/deployments/networks.json'
import { Contract } from 'ethers'
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import config from '../config'

export function getContract(providerOrSigner?: Signer | Provider) {
  const chainId = 1; // TODO
  const abi = networks[chainId]?.abi
  if(!abi) {
    throw new Error('unsupported network')
  }
  return new Contract(config.contractAddress, abi, providerOrSigner)
}
