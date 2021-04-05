import networks from '../../contracts/deployments/networks.json'
import { Contract, providers } from 'ethers'
import { Provider } from "@ethersproject/abstract-provider";
import config from '../config'

const defaultProvider = new providers.InfuraProvider(config.defaultChainId, config.infuraId)

export async function getContract(providerOrSigner:Provider = defaultProvider) {
  const network = await providerOrSigner.getNetwork();
  const contractInfo = networks[network.chainId];
  if(!contractInfo) {
    throw new Error('unsupported network')
  }
  const { address, abi } = contractInfo
  return new Contract(address, abi, providerOrSigner)
}
