import * as fs from 'fs';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const contractName = 'ArbArt'
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const namedAccounts = await getNamedAccounts();

  const deployment = await deploy(contractName, {
    from: namedAccounts.deployer,
    args: [namedAccounts.manager],
    log: true
  });

  const networkData = {
    network: hre.network.name,
    address: deployment.address,
    startBlock: deployment.receipt?.blockNumber,
  };

  fs.writeFileSync(
    `./deployments/${hre.network.name}/config.json`,
    JSON.stringify(networkData, null, 2)
  )
  fs.writeFileSync(
    `./deployments/${hre.network.name}/${contractName}.abi.json`,
    JSON.stringify(deployment.abi, null, 2)
  )

  const chainId = hre.network.config.chainId
  if(chainId) {

    let networksABI: Record<number, any>
    try {
      networksABI = fs.readFileSync('./deployments/networks.json')
    } catch(_) {
      networksABI = {}
    }

    networksABI[chainId] = {
      address: deployment.address,
      abi: deployment.abi,
    }

    fs.writeFileSync(
      './deployments/networks.json',
      JSON.stringify(networksABI, null, 2)
    )
  }

};
export default func;
func.tags = ['ArbArt'];
