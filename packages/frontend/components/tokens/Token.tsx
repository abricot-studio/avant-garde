import { faRedditAlien } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowLeft,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addressEqual, isTestChain, useEthers } from '@usedapp/core'
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
import { TokenImage } from './TokenImage'

function BurnButton({ token }) {
  const { account } = useEthers()
  const tokenBurnPrice = useBurnPrice()

  const { burn, burned, isBurning } = useBurn()

  if (!account || !addressEqual(account, token.owner)) {
    return null
  }

  if (!tokenBurnPrice) {
    return <ActionButton isLoading loadingText="Loading burn price..." />
  } else if (burned) {
    return <ActionButton isDisabled>Burned</ActionButton>
  }

  return (
    <ActionButton
      onClick={() => burn(token.id)}
      isLoading={isBurning}
      loadingText="Burning token..."
    >
      Burn for{' '}
      <Text ml={4}>
        Ξ{' '}
        {utils.formatEther(
          utils.parseUnits(tokenBurnPrice.currentPrice, 'wei')
        )}
      </Text>
    </ActionButton>
  )
}

function SocialLink({ href, icon, label }) {
  return (
    <CLink href={href} isExternal>
      <IconButton
        icon={icon}
        aria-label={label}
        colorScheme="transparent"
        color="black"
        _hover={{}}
        _focus={{
          outline: 'none',
        }}
        _active={{
          outline: 'none',
        }}
      />
    </CLink>
  )
}

export default function Token({ id }) {
  const { token, fetching } = useToken(id)
  const router = useRouter()

  const { address: contractAddress, chainId } = useContract()
  const isMounted = useMountedState()

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

      <TokenImage avantGardeToken={token} />

      <Card mt={8}>
        <HStack justifyContent="center">
          <VStack justify="space-between" alignItems="start">
            <Box fontWeight={500}>Mint Date</Box>
            <Box fontWeight={500}>Mint Price</Box>
            {token.burnTimestamp && <Box>Burn Date</Box>}
          </VStack>
          <VStack justify="space-between" alignItems="start">
            <Box>
              {moment(Number(token.mintTimestamp) * 1000).format('YYYY-MM-DD')}
            </Box>
            <Box>
              Ξ {utils.formatEther(utils.parseUnits(token.mintPrice, 'wei'))}
            </Box>
            {token.burnTimestamp && (
              <Box>{moment(Number(token.burnTimestamp) * 1000).format()}</Box>
            )}
          </VStack>

          { token.burnPrice && (
            <VStack justify="space-between" alignItems="start">
              <Box fontWeight={500}>Burn Date</Box>
              <Box fontWeight={500}>Burn Price</Box>
              {token.burnTimestamp && <Box>Burn Date</Box>}
            </VStack>
          )}
          {token.burnPrice && (
            <VStack justify="space-between">
              <Box>Burn Date</Box>
              <Box>Burn Price</Box>
              <Box>
                Ξ {utils.formatEther(utils.parseUnits(token.burnPrice, 'wei'))}
              </Box>
              <Box>Burn Price</Box>
            </VStack>
          )}
        </HStack>
      </Card>

      <Box align="center" mt={4}>
        <BurnButton token={token} />
      </Box>

      <Box align="center" mt={4}>
        <CLink href={socialPostUrls.opensea} isExternal>
          <Button
            rightIcon={<FontAwesomeIcon icon={faExternalLinkAlt} size="1x" />}
            variant="outline"
          >
            Trade on OpenSea
          </Button>
        </CLink>
      </Box>

      <HStack spacing={12} mt={4} justifyContent="center">
        <SocialLink
          icon={<FontAwesomeIcon icon={faRedditAlien} size="2x" />}
          href={socialPostUrls.reddit}
          label="reddit"
        />
        <SocialLink
          icon={<TwitterIcon w={8} h={8} />}
          href={socialPostUrls.twitter}
          label="twitter"
        />
      </HStack>
    </Flex>
  )
}
