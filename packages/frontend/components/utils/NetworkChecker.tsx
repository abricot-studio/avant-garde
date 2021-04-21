import { getChainName, useEthers } from '@usedapp/core'
import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalContent, Text, Button } from '../ui'
import config from '../../config'
import { useContract } from '../../hooks/contracts'

export function NetworkChecker({ children }) {
  const contractInfo = useContract();
  const { deactivate } = useEthers();

  if(!contractInfo) {
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
              onClick={deactivate}
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
