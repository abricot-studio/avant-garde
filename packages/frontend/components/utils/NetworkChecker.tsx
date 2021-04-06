import { useMemo } from 'react'
import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalContent, Text } from '../ui'
import { useWeb3 } from '../../contexts/Web3Context'
import networks from '../../../contracts/deployments/networks.json'
import config from '../../config'

const networkName = {
  1: 'Mainnet',
  4: 'Rinkeby',
}

export function NetworkChecker({ children }) {
  const {account} = useWeb3()

  const contractInfo = useMemo(() => account?.chainId && networks[account.chainId], [account]);

  if(account && !contractInfo) {
    return (
        <Modal isOpen isCentered onClose={() => 0}>
          <ModalOverlay />
          <ModalContent pt={2} pb={4}>
            <ModalHeader textAlign="center">Unsupported network</ModalHeader>
            <ModalBody textAlign="center">
              <Text>
                Please switch your wallet to a supported network:
              </Text>
              <Text textStyle="caption" colorScheme="red">
                {networkName[config.defaultChainId] || config.defaultChainId}
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
    )
  }

  return children;
}
