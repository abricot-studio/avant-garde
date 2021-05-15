import { useDisclosure } from '@chakra-ui/hooks'
import { ScaleFade } from '@chakra-ui/react'
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowLeft,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  addressEqual,
  getExplorerTransactionLink,
  isTestChain,
  useEthers,
} from '@usedapp/core'
import BigNumber from 'bignumber.js'
import { utils } from 'ethers'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useMountedState } from 'react-use'
import { TwitterIcon } from '../../assets/icons'
import { useBurn, useBurnPrice } from '../../hooks/burn'
import { useContract } from '../../hooks/contracts'
import { useToken } from '../../hooks/tokens'
import {
  ActionButton,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link as CLink,
  Spinner,
  Text,
  VStack,
} from '../ui'
import { defaultSize, TokenImage } from './TokenImage'

function BurnButton({ token, isOpen, onToggle }) {
  const { account } = useEthers()
  const tokenBurnPrice = useBurnPrice()

  const { burn, burned, isBurning } = useBurn()

  if (!account || !addressEqual(account, token.owner)) {
    return null
  }

  if (!tokenBurnPrice) {
    return (
      <Button
        isLoading
        loadingText="Loading burn price..."
        borderRadius="full"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
        fontFamily='"Roboto Mono", sans-serif'
        size="sm"
      />
    )
  } else if (burned) {
    return (
      <Button
        isDisabled
        borderRadius="full"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
        fontFamily='"Roboto Mono", sans-serif'
        size="sm"
      >
        🔥 Burned
      </Button>
    )
  }

  return (
    <Box>
      <Button
        onClick={() => burn(token.id)}
        isLoading={isBurning}
        loadingText="🔥 Burning token..."
        borderRadius="full"
        backgroundColor="white"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
        fontFamily='"Roboto Mono", sans-serif'
        size="sm"
        _hover={{}}
        role="group"
        onMouseEnter={onToggle}
        onMouseLeave={onToggle}
      >
        <Text>🔥</Text>
        <ScaleFade initialScale={0} in={isOpen} unmountOnExit reverse>
          <Text pl={4} fontWeight={700} fontVariant="small-caps">
            Burn for Ξ
            {utils.formatEther(
              utils.parseUnits(tokenBurnPrice.currentPrice, 'wei')
            )}
          </Text>
        </ScaleFade>
      </Button>
    </Box>
  )
}

function SocialLink({ href, icon, label, ...props }) {
  return (
    <CLink href={href} isExternal {...props}>
      <IconButton
        icon={icon}
        aria-label={label}
        variant="outline"
        borderRadius="full"
        size="lg"
        backgroundColor="white"
        _hover={{}}
        _focus={{
          outline: 'none',
        }}
        _active={{
          outline: 'none',
        }}
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
      />
    </CLink>
  )
}

export default function Token({ id }) {
  const { token, fetching } = useToken(id)
  const router = useRouter()

  const { address: contractAddress, chainId } = useContract()
  const { burnTx } = useBurn()
  const isMounted = useMountedState()
  const { isOpen, onToggle } = useDisclosure()

  const socialPostUrls = useMemo(() => {
    if (!isMounted() || !token) return {}

    const message = encodeURI('Look at this unique AI-generated piece of art !')
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const permalink = `${origin}/token/${id}`

    const reddit = `https://reddit.com/submit?url=${permalink}&title=${message}`
    const twitter = `https://twitter.com/intent/tweet?text=${message}&via=avantgardenft&url=${permalink}&hashtags=nft,art,deeplearning`
    const openseaId = new BigNumber(id).toFixed()
    const testnetPrefix = isTestChain(chainId) ? 'testnets.' : ''
    const opensea = `https://${testnetPrefix}opensea.io/assets/${contractAddress}/${openseaId}`

    return {
      reddit,
      twitter,
      opensea,
    }
  }, [token, contractAddress, chainId])

  if (fetching)
    return (
      <Box align="center">
        <Spinner size="lg" />
      </Box>
    )
  if (!token) return <Box align="center">Not found!</Box>

  return (
    <Flex as="section" mt={4} direction="column" align="center">
      <Heading
        mb={4}
        as="h3"
        textStyle="h3"
        textAlign="center"
        fontSize="1rem"
        textTransform="lowercase"
        fontFamily="'Roboto Mono', sans-serif"
        maxWidth="50rem"
      >
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="grey"
          _hover={{}}
          _focus={{
            outline: 'none',
          }}
          onClick={() => router.push('/gallery')}
        />
        {id}
      </Heading>
      <Box>
        <Box
          position="absolute"
          width={defaultSize}
          height={defaultSize}
          zIndex={1}
        >
          <SocialLink
            icon={<TwitterIcon w={4} h={4} fill="#1FA1F1" />}
            href={socialPostUrls.twitter}
            label="twitter"
            position="absolute"
            left="10%"
            top="80%"
            sx={{
              animation: isOpen
                ? 'x-motion-l-up 1s ease-out forwards'
                : 'x-motion-l-down 1s ease-out forwards',
              '@keyframes x-motion-l-up': {
                '0%': {
                  top: '80%',
                  left: '10%',
                },
                '100%': {
                  top: '60%',
                  left: '0%',
                },
              },
              '@keyframes x-motion-l-down': {
                '0%': {
                  top: '60%',
                  left: '0%',
                },
                '100%': {
                  top: '80%',
                  left: '10%',
                },
              },
            }}
          />
          <SocialLink
            icon={
              <FontAwesomeIcon icon={faRedditAlien} size="1x" color="#FF4500" />
            }
            href={socialPostUrls.reddit}
            label="reddit"
            position="absolute"
            right="10%"
            top="80%"
            sx={{
              animation: isOpen
                ? 'x-motion-r-up 1s ease-out forwards'
                : 'x-motion-r-down 1s ease-out forwards',
              '@keyframes x-motion-r-up': {
                '0%': {
                  top: '80%',
                  right: '10%',
                },
                '100%': {
                  top: '60%',
                  right: '0%',
                },
              },
              '@keyframes x-motion-r-down': {
                '0%': {
                  top: '60%',
                  right: '0%',
                },
                '100%': {
                  top: '80%',
                  right: '10%',
                },
              },
            }}
          />
          <Box position="absolute" top="93%" textAlign="center" width="100%">
            <BurnButton token={token} isOpen={isOpen} onToggle={onToggle} />
          </Box>
        </Box>
        <TokenImage avantGardeToken={token} size={defaultSize} />
      </Box>

      <Box align="center" mt={8}>
        <CLink
          href={socialPostUrls.opensea}
          isExternal
          _hover={{}}
          _active={{}}
          _focus={{}}
        >
          <ActionButton>
            <Text pr={4}>Trade on OpenSea</Text>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </ActionButton>
        </CLink>
      </Box>

      <Card mt={8}>
        <HStack justifyContent="center">
          <VStack justify="space-between" alignItems="start">
            <Box fontWeight={600}>⌛ Mint Date</Box>
            <Box fontWeight={600}>⛏ Mint Price</Box>
          </VStack>
          <VStack justify="space-between" alignItems="start">
            <Box>
              {moment(Number(token.mintTimestamp) * 1000)
                .format('YYYYMMMDD')
                .toUpperCase()}
            </Box>
            <Box>
              Ξ {utils.formatEther(utils.parseUnits(token.mintPrice, 'wei'))}
            </Box>
          </VStack>

          {token.burnPrice && (
            <VStack justify="space-between" alignItems="start">
              <Box fontWeight={600}>⌛ Burn Date</Box>
              <Box fontWeight={600}>🔥 Burn Price</Box>
            </VStack>
          )}
          {token.burnPrice && (
            <VStack justify="space-between" alignItems="start">
              <Box>
                {moment(Number(token.burnTimestamp) * 1000)
                  .format('YYYYMMMDD')
                  .toUpperCase()}
              </Box>
              <Box>
                Ξ {utils.formatEther(utils.parseUnits(token.burnPrice, 'wei'))}
              </Box>
            </VStack>
          )}
        </HStack>
        {burnTx && (
          <HStack justifyContent="center" mt={2}>
            <CLink
              href={getExplorerTransactionLink(burnTx, chainId)}
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
    </Flex>
  )
}
