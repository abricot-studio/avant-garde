import React from 'react'
import { Flex, Box, Heading, HStack, VStack, IconButton, ActionButton } from '../ui'
import { useToken, useTokenPriceBurn } from '../../hooks/tokens'
import { TokenImage } from '../ui/TokenImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faReddit, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { useRouter } from 'next/router'
import { utils } from 'ethers'
import { useWeb3 } from '../../contexts/Web3Context'
import { useBurn } from '../../hooks/burn'

function BurnButton({ token }){
  const { account } = useWeb3()
  const { tokenBurnPrice, fetching } = useTokenPriceBurn()

  const { burn, burned, isBurning } = useBurn()

  if(!account || account.address.toLowerCase() !== token.owner.toLowerCase()){
    return null
  }

  if(fetching || !tokenBurnPrice){
    return (
      <ActionButton
        isLoading
      >
        Loading burn price...
      </ActionButton>
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
    >Burn for Ξ
      {utils.formatEther(utils.parseUnits(tokenBurnPrice.currentPrice, 'wei') )}
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
      mb={12}
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
      <Box>
        <TokenImage
          size={350}
          arbArtToken={token}
        />
        <VStack>
          <HStack justify="space-between">
            <Box>Mint Date</Box>
            <Box>{new Date(Number(token.mintTimestamp) * 1000).toISOString()}</Box>
          </HStack>
          <HStack justify="space-between">
            <Box>Mint Price</Box>
            <Box>Ξ {utils.formatEther(utils.parseUnits(token.mintPrice, 'wei') )}</Box>
          </HStack>
          {
            token.burnTimestamp &&
            <HStack justify="space-between">
              <Box>Burn Date</Box>
              <Box>{new Date(Number(token.burnTimestamp) * 1000).toISOString()}</Box>
            </HStack>
          }
          {
            token.burnPrice &&
            <HStack justify="space-between">
              <Box>Burn Price</Box>
              <Box>Ξ {utils.formatEther(utils.parseUnits(token.burnPrice, 'wei') )}</Box>
            </HStack>
          }
          <HStack spacing={12}>
            <IconButton
              icon={<FontAwesomeIcon icon={faReddit} size="3x" />}
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
              icon={<FontAwesomeIcon icon={faTwitter} size="3x" />}
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
              icon={<FontAwesomeIcon icon={faInstagram} size="3x" />}
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
        </VStack>
        <Box align="center" mt={8}>
          <BurnButton token={token} />
        </Box>
      </Box>
    </Flex>
  )
}
