import { useDisclosure } from '@chakra-ui/hooks'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  getExplorerTransactionLink,
  isTestChain,
  useEthers,
} from '@usedapp/core'
import { utils } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { useMountedState } from 'react-use'
import config from '../../config'
import { useAuth } from '../../hooks/authContext'
import { useContract } from '../../hooks/contracts'
import {
  ImageGenerationStatus,
  useImageGeneration,
} from '../../hooks/generation'
import { useMint, useMintPrice } from '../../hooks/mint'
import { getIpfsUrl } from '../../lib/ipfs'
import { useWalletSelector } from '../../lib/WalletSelector/context'
import { ImageFrame } from '../tokens/TokenImage'
import {
  ActionButton,
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  Link as CLink,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from '../ui'

export default function Generate() {
  const { isConnecting, open } = useWalletSelector()
  const { account, chainId } = useEthers()
  const { address: contractAddress } = useContract()
  const { accountToken, accountTokenFetching, inviteCode, setInviteCode } =
    useAuth()
  const tokenMintPrice = useMintPrice()
  const { generateImage, isGenerating, generationResult, errorGenerating } =
    useImageGeneration()
  const { mint, minted, isMinting, mintTx } = useMint()
  const router = useRouter()
  const toast = useToast()
  const isMounted = useMountedState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleChangeInviteCode = (event) => setInviteCode(event.target.value)

  const socialPostUrls = useMemo(() => {
    if (!isMounted()) return {}
    const testnetPrefix = isTestChain(chainId) ? 'testnets.' : ''
    const opensea = `https://${testnetPrefix}opensea.io/assets/${contractAddress}`

    return {
      opensea,
    }
  }, [contractAddress, chainId])

  useEffect(() => {
    if (errorGenerating && !!errorGenerating.message) {
      onOpen()
    } else {
      onClose()
    }
  }, [errorGenerating])

  useEffect(() => {
    if (accountToken && !accountTokenFetching) {
      toast.closeAll()
      router.push(`/token/${accountToken.id}`)
    } else if (config.whitelistMode) {
      router.replace(`/`)
    }
  }, [accountToken, accountTokenFetching])

  let cta
  if (accountToken || accountTokenFetching) {
    cta = <ActionButton isLoading loadingText="Loading token..." />
  } else if (minted) {
    cta = <ActionButton isDisabled>⛏ Minted successfully !</ActionButton>
  } else if (!account) {
    cta = (
      <ActionButton
        onClick={open}
        isLoading={isConnecting}
        loadingText="Connecting wallet..."
      >
        Connect wallet
      </ActionButton>
    )
  } else if (generationResult) {
    if (!tokenMintPrice) {
      cta = <ActionButton isLoading loadingText="Loading mint price..." />
    } else {
      cta = (
        <Box>
          <ActionButton
            onClick={() => mint(generationResult)}
            isLoading={isMinting}
            loadingText="⛏ Minting art..."
          >
            ⛏ Mint for{' '}
            <Text ml={2}>
              Ξ{' '}
              {utils.formatEther(utils.parseUnits(tokenMintPrice.total, 'wei'))}
            </Text>
          </ActionButton>
        </Box>
      )
    }
  } else {
    cta = (
      <ActionButton
        onClick={() => generateImage()}
        isLoading={isGenerating}
        loadingText="🎨 Generating art..."
      >
        Generate yours
      </ActionButton>
    )
  }

  const imageSrc =
    generationResult &&
    generationResult.status === ImageGenerationStatus.SUCCESS &&
    getIpfsUrl(generationResult.ipfsHashImage)
  return (
    <Flex direction="column" align="center">
      <ImageFrame
        src={imageSrc}
        isLoading={isGenerating}
        isQuestion={!isGenerating && !generationResult}
      />

      <Box mt={8}>{cta}</Box>
      {!isGenerating && !generationResult && (
        <>
          <Text
            align="center"
            py={6}
            px={4}
            fontSize="0.8rem"
            fontWeight={600}
            fontFamily="Poppins, sans-serif"
          >
            You will get unique artwork based on your address, directly
            integrated and tradebale in
            <CLink
              href={socialPostUrls.opensea}
              isExternal
              _hover={{}}
              _active={{}}
              _focus={{}}
            >
              <Image
                src="/opensea.png"
                alt="opensea"
                h="1.2rem"
                w="5.2rem"
                display="inline"
                verticalAlign="bottom"
                pl={2}
              />
            </CLink>
          </Text>
        </>
      )}
      {isGenerating && (
        <Card mt={8} mb={8}>
          <Flex direction="column" align="center" fontSize="sm">
            <Text align="center">Your image is being generated.</Text>
            <Text align="center">
              The processing can take up to 30 seconds.
            </Text>
            <Text align="center" fontWeight={500}>
              Each image is uniquely generated from your Ethereum address by a
              deep-learning algorithm{' '}
            </Text>

            <Link href="/about">
              <Button
                variant="outline"
                size="sm"
                _hover={{}}
                _active={{}}
                _focus={{}}
                mt={2}
              >
                Learn more
              </Button>
            </Link>
          </Flex>
        </Card>
      )}

      {tokenMintPrice && generationResult && (
        <Card my={8}>
          <HStack justifyContent="center">
            <VStack alignItems="start">
              <Flex fontWeight={500}>💰 Price</Flex>
              <Flex fontWeight={500}>☕️ Platform fees</Flex>
            </VStack>
            <VStack alignItems="start">
              <Flex>
                <Text ml={4}>
                  Ξ{' '}
                  {utils.formatEther(
                    utils.parseUnits(tokenMintPrice.currentPrice, 'wei')
                  )}
                </Text>
              </Flex>
              <Flex>
                <Text ml={4}>
                  Ξ{' '}
                  {utils.formatEther(
                    utils.parseUnits(tokenMintPrice.fees, 'wei')
                  )}
                </Text>
              </Flex>
            </VStack>
          </HStack>
          {mintTx && (
            <HStack justifyContent="center" mt={2}>
              <CLink
                href={getExplorerTransactionLink(mintTx, chainId)}
                isExternal
                color="#6B93FB"
              >
                <Button
                  rightIcon={
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="1x" />
                  }
                  variant="outline"
                  size="sm"
                  color="#6B93FB"
                  fontFamily='"Roboto Mono", sans-serif'
                  _hover={{}}
                  _active={{}}
                  _focus={{}}
                >
                  Open Transaction
                </Button>
              </CLink>
            </HStack>
          )}
        </Card>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader textAlign="center">
            Want to become an AvantGardist?
          </ModalHeader>
          <ModalBody py={0}>
            <Flex align="center" direction="column">
              <Text pb={4}>
                Enter an invitation code to access the Generator and mint your
                unique piece of art.
              </Text>
              <FormControl id="invite-code" flex="column" align="center">
                <Flex>
                  <FormLabel>Invitation code</FormLabel>
                  {errorGenerating &&
                    errorGenerating.message !== 'not_invited' && (
                      <FormHelperText
                        flexGrow={1}
                        textAlign={'right'}
                        color="#FB6B6B"
                      >
                        {errorGenerating.message}
                      </FormHelperText>
                    )}
                </Flex>
                <Input
                  boxShadow="inset 0px 4px 20px rgba(129, 129, 129, 0.15)"
                  borderRadius="md"
                  px={4}
                  value={inviteCode}
                  onChange={handleChangeInviteCode}
                  onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                />
                <ActionButton
                  onClick={() => generateImage()}
                  isLoading={isGenerating}
                  disabled={inviteCode === ''}
                  loadingText="Validating code..."
                  type="submit"
                  mt={6}
                  mb={4}
                >
                  Validate
                </ActionButton>
              </FormControl>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
