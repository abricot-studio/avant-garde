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
import { useContract } from '../../hooks/contracts'
import {
  ImageGenerationStatus,
  useImageGeneration,
} from '../../hooks/generation'
import { useMint, useMintPrice } from '../../hooks/mint'
import { useToken } from '../../hooks/tokens'
import { getIpfsUrl } from '../../lib/ipfs'
import { useWalletSelector } from '../../lib/WalletSelector/context'
import { ImageFrame } from '../tokens/TokenImage'
import {
  ActionButton,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  Link as CLink,
  Text,
  useToast,
  VStack,
} from '../ui'

export default function Generate() {
  const { isConnecting, open } = useWalletSelector()
  const { account, chainId } = useEthers()
  const { address: contractAddress } = useContract()
  const { token, fetching: fetchingToken } = useToken(account)
  const tokenMintPrice = useMintPrice()
  const { generateImage, isGenerating, generationResult } = useImageGeneration()
  const { mint, minted, isMinting, mintTx } = useMint()
  const router = useRouter()
  const toast = useToast()
  const isMounted = useMountedState()

  const socialPostUrls = useMemo(() => {
    if (!isMounted()) return {}
    const testnetPrefix = isTestChain(chainId) ? 'testnets.' : ''
    const opensea = `https://${testnetPrefix}opensea.io/assets/${contractAddress}`

    return {
      opensea,
    }
  }, [contractAddress, chainId])

  useEffect(() => {
    if (token) {
      toast.closeAll()
      router.push(`/token/${token.id}`)
    } else if (config.whitelistMode) {
      router.replace(`/`)
    }
  }, [token])

  let cta
  if (token || fetchingToken) {
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
          <Flex direction="column" align="center">
            <Text align="center">Your image is being generated.</Text>
            <Text align="center">
              The processing can take up to 30 seconds.
            </Text>
            <Text align="center" fontWeight={500}>
              Each image is uniquely generated from your Ethereum address by
              deep learning algorithm{' '}
            </Text>

            <Link href="/about">
              <Button
                variant="outline"
                size="sm"
                _hover={{}}
                _active={{}}
                _focus={{}}
              >
                Learn more
              </Button>
            </Link>
          </Flex>
        </Card>
      )}

      {tokenMintPrice && generationResult && (
        <Card mt={8}>
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
    </Flex>
  )
}
