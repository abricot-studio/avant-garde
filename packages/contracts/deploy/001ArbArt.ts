import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const a = await getNamedAccounts();

  await deploy('ArbArt', {
    from: a.deployer,
    args: [],
    log: true,
  });
};
export default func;
func.tags = ['ArbArt'];
