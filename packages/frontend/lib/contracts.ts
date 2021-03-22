import abi from '../../contracts/dist/ArbArt.abi.json'
import { Contract } from 'ethers'
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import config from '../config'

export function getContract(providerOrSigner?: Signer | Provider) {
  return new Contract(config.contractAddress, abi, providerOrSigner)
}
