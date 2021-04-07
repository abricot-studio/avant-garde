import { useMemo } from 'react'
import { getChainName } from '@usedapp/core'
import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalContent, Text, Button } from '../ui'
import { useWeb3 } from '../../contexts/Web3Context'
import networks from '../../../contracts/deployments/networks.json'
import config from '../../config'

export function NetworkChecker({ children }) {
  const {account, disconnect} = useWeb3()

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
              {getChainName(config.defaultChainId) || config.defaultChainId}
            </Text>
            <Button
              onClick={disconnect}
              variant="outline"
              colorScheme="red"
              mt={4}
            >
              Disconnect
            </Button>

          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  return children;
}
