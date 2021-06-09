import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import React from 'react'
import { useWalletSelector } from './context'
import { options } from './options'
import { useBreakpointValue } from '../../components/ui'

export function WalletSelectorModal() {
  const { isConnecting, modalOpen, close, connect, disconnect } =
    useWalletSelector()
  const mobile = useBreakpointValue({ base: true, md: false, lg: false })

  return (
    <Modal isOpen={modalOpen} isCentered onClose={close}>
      <ModalOverlay />
      <ModalContent pt={2} pb={4}>
        {isConnecting ? (
          <>
            <ModalHeader textAlign="center">Connecting wallet...</ModalHeader>
            <ModalBody>
              <Flex align="center" direction="column">
                <Spinner size="lg" />
                <Button
                  onClick={disconnect}
                  variant="outline"
                  colorScheme="red"
                  mt={4}
                >
                  Cancel
                </Button>
              </Flex>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader textAlign="center">Select wallet</ModalHeader>
            <ModalBody textAlign="center">
              <Wrap justify="center" spacing={4}>
                {options.map((option) => (
                  <WrapItem key={option.name}>
                    <Button
                      onClick={() => mobile && option.name === 'MetaMask' ? window.open(option.deepLink) : connect(option.connector)}
                      variant="outline"
                      width={40}
                      height={32}
                    >
                      <Flex direction="column" align="center">
                        <Image src={option.icon} boxSize={12} />
                        <Text mt={4} textTransform="initial" fontWeight={400}>
                          {option.name}
                        </Text>
                        {/*<Text>*/}
                        {/*  {option.description}*/}
                        {/*</Text>*/}
                      </Flex>
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
