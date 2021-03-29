import networks from '../../contracts/deployments/networks.json'
import { Contract } from 'ethers'
import { Provider } from "@ethersproject/abstract-provider";

export async function getContract(providerOrSigner?: Provider) {
  const network = await providerOrSigner.getNetwork();
  const contractInfo = networks[network.chainId];
  if(!contractInfo) {
    throw new Error('unsupported network')
  }
  const { address, abi } = contractInfo
  return new Contract(address, abi, providerOrSigner)
}
