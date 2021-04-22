import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons'
import { useRouter } from 'next/router'
import { utils } from 'ethers'
import moment from 'moment'
import { addressEqual } from '@usedapp/core'

import { Flex, Box, Heading, HStack, VStack, IconButton, ActionButton, Text, Icon, Card } from '../ui'
import { useWeb3 } from '../../contexts/Web3Context'
import { useToken, useTokenPriceBurn } from '../../hooks/tokens'
import { TokenImage } from './TokenImage'
import { useBurn } from '../../hooks/burn'
import { InstagramIcon, TwitterIcon } from '../../assets/icons'

function BurnButton({ token }){
  const { account } = useWeb3()
  const { tokenBurnPrice, fetching } = useTokenPriceBurn()

  const { burn, burned, isBurning } = useBurn()

  if(!account || !addressEqual(account.address, token.owner)){
    return null
  }

  if(fetching || !tokenBurnPrice){
    return (
      <ActionButton
        isLoading
        loadingText="Loading burn price..."
      />
    )
  } else if(burned){
    return (
      <ActionButton
        isDisabled
      >Burned</ActionButton>
    )
  }

  return (
    <ActionButton
      onClick={() => burn(token.id)}
      isLoading={isBurning}
      loadingText="Burning token..."
    >Burn for <Text ml={4}>Ξ {utils.formatEther(utils.parseUnits(tokenBurnPrice.currentPrice, 'wei') )}</Text>
    </ActionButton>
  )
}

export default function Token({ id }) {
  const { token, fetching } = useToken(id)
  const router = useRouter()

  if (fetching) return <Box align="center" >Loading...</Box>
  if (!token) return <Box align="center" >not existings</Box>

  return (
    <Flex
      as="section"
      mt={4}
      direction="column"
      align="center"
    >
      <Heading
        mb={4}
        as="h3"
        textStyle="h3"
        textAlign="center"
        fontSize={{ base: '2rem', sm: '3rem', md: '4rem' }}
        maxWidth="50rem"
      >
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="grey"
          _hover={{}}
          _focus={{
            outline: "none"
          }}
          onClick={() => router.push('/gallery') }
        />
        {id}
      </Heading>

      <TokenImage
        avantGardeToken={token}
      />

      <Card
        mt={8}
      >
        <HStack
          justifyContent="center"
        >
          <VStack
            justify="space-between"
            alignItems="start"
          >
            <Box
              fontWeight={500}
            >Mint Date</Box>
            <Box
              fontWeight={500}
            >Mint Price</Box>
            {
              token.burnTimestamp &&
              <Box>Burn Date</Box>
            }
          </VStack>
          <VStack
            justify="space-between"
            alignItems="start"
          >
            <Box>{moment(Number(token.mintTimestamp) * 1000).format('YYYY-MM-DD')}</Box>
            <Box>Ξ {utils.formatEther(utils.parseUnits(token.mintPrice, 'wei') )}</Box>
            {
              token.burnTimestamp &&
              <Box>{moment(Number(token.burnTimestamp) * 1000).format()}</Box>
            }
          </VStack>
          {
            token.burnPrice &&
            <HStack justify="space-between">
              <Box>Burn Price</Box>
              <Box>Ξ {utils.formatEther(utils.parseUnits(token.burnPrice, 'wei') )}</Box>
              <Box>Burn Price</Box>
            </HStack>
          }
        </HStack>

      </Card>

      <Box align="center" mt={8}>
        <BurnButton token={token} />
      </Box>

      <HStack
        spacing={12}
        mt={8}
        justifyContent="center"
      >
        <IconButton
          icon={<FontAwesomeIcon icon={faRedditAlien} size="2x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="black"
          _hover={{}}
          _focus={{
            outline: "none"
          }}
          _active={{
            outline: "none"
          }}
        />
        <IconButton
          icon={<TwitterIcon w={8} h={8} />}
          aria-label="Back"
          colorScheme="transparent"
          color="black"
          _hover={{}}
          _focus={{
            outline: "none"
          }}
          _active={{
            outline: "none"
          }}
        />
        <IconButton
          icon={<InstagramIcon w={8} h={8} />}
          aria-label="Back"
          colorScheme="transparent"
          color="black"
          _hover={{}}
          _focus={{
            outline: "none"
          }}
          _active={{
            outline: "none"
          }}
        />
      </HStack>
    </Flex>
  )
}
