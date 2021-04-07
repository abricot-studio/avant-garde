import networks from '../../contracts/deployments/networks.json'
import { Contract, providers } from 'ethers'
import { Provider } from "@ethersproject/abstract-provider";
import config from '../config'

const defaultProvider = new providers.InfuraProvider(config.defaultChainId, config.infuraId)

export function getContractInfoFromNetwork(chainId: number) {
  return networks[chainId] || null;
}

export async function getContractFromProvider(providerOrSigner:Provider = defaultProvider) {
  const network = await providerOrSigner.getNetwork();
  const contractInfo = getContractInfoFromNetwork(network.chainId);
  const { address, abi } = contractInfo;

  if(!contractInfo) {
    throw new Error('unsupported network')
  }

  return new Contract(address, abi, providerOrSigner)
}
