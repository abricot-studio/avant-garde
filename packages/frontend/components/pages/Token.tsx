import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons'
import { useRouter } from 'next/router'
import { utils } from 'ethers'
import { addressEqual } from '@usedapp/core'

import { Flex, Box, Heading, HStack, VStack, IconButton, ActionButton, Text, Icon, Card } from '../ui'
import { useWeb3 } from '../../contexts/Web3Context'
import { useToken } from '../../hooks/tokens'
import { TokenImage } from '../ui/TokenImage'
import { useBurn, useBurnPrice } from '../../hooks/burn'
import moment from 'moment'

export const InstagramIcon = (props) => (
  <Icon viewBox="0 0 41 40" {...props}>
    <path d="M12.5232 0C5.8485 0 0.417969 5.43053 0.417969 12.1053V27.8947C0.417969 34.5695 5.8485 40 12.5232 40H28.3127C34.9874 40 40.418 34.5695 40.418 27.8947V12.1053C40.418 5.43053 34.9874 0 28.3127 0H12.5232ZM30.9443 7.36842C32.1074 7.36842 33.0495 8.31053 33.0495 9.47368C33.0495 10.6358 32.1074 11.5789 30.9443 11.5789C29.7811 11.5789 28.839 10.6358 28.839 9.47368C28.839 8.31053 29.7811 7.36842 30.9443 7.36842ZM20.418 9.47368C26.2222 9.47368 30.9443 14.1958 30.9443 20C30.9443 25.8042 26.2222 30.5263 20.418 30.5263C14.6138 30.5263 9.89165 25.8042 9.89165 20C9.89165 14.1958 14.6138 9.47368 20.418 9.47368ZM20.418 12.6316C19.4503 12.6316 18.4922 12.8222 17.5982 13.1925C16.7042 13.5628 15.8919 14.1055 15.2077 14.7897C14.5235 15.474 13.9807 16.2863 13.6104 17.1802C13.2401 18.0742 13.0495 19.0324 13.0495 20C13.0495 20.9676 13.2401 21.9258 13.6104 22.8198C13.9807 23.7138 14.5235 24.526 15.2077 25.2103C15.8919 25.8945 16.7042 26.4372 17.5982 26.8075C18.4922 27.1778 19.4503 27.3684 20.418 27.3684C21.3856 27.3684 22.3438 27.1778 23.2377 26.8075C24.1317 26.4372 24.944 25.8945 25.6282 25.2103C26.3125 24.526 26.8552 23.7138 27.2255 22.8198C27.5958 21.9258 27.7864 20.9676 27.7864 20C27.7864 19.0324 27.5958 18.0742 27.2255 17.1802C26.8552 16.2863 26.3125 15.474 25.6282 14.7897C24.944 14.1055 24.1317 13.5628 23.2377 13.1925C22.3438 12.8222 21.3856 12.6316 20.418 12.6316Z" fill="black"/>
  </Icon>
)

export const TwitterIcon = (props) => (
  <Icon viewBox="0 0 40 35" {...props}>
    <path d="M39.7322 4.18542C39.4513 3.88889 39.0189 3.80431 38.6503 3.97736L38.4942 4.05028C38.3618 4.1125 38.2294 4.17472 38.0961 4.23597C38.4837 3.605 38.7913 2.93028 39.0037 2.23222C39.1218 1.84722 38.9932 1.42625 38.6808 1.17736C38.3685 0.928472 37.938 0.902222 37.5999 1.11319C36.5132 1.78694 35.4695 2.27208 34.3904 2.61042C32.7619 0.9975 30.5438 0 28.0953 0C23.0982 0 19.0478 4.13486 19.0478 9.23611C19.0478 9.24097 19.0478 9.43347 19.0478 9.72222L18.0964 9.64444C8.83658 8.52639 6.20043 2.16806 6.09091 1.89389C5.91377 1.43694 5.5233 1.10347 5.05188 1.00333C4.58141 0.90125 4.09285 1.05194 3.7519 1.39903C3.56333 1.5925 1.90526 3.38333 1.90526 6.80556C1.90526 9.24389 2.97001 11.2214 4.34808 12.7594C3.70619 12.3599 3.33191 12.0361 3.32238 12.0274C2.88334 11.6365 2.25478 11.5549 1.73289 11.8251C1.2129 12.0964 0.906234 12.6632 0.958614 13.2572C0.976709 13.4624 1.38242 17.3532 5.7852 20.2913L4.98235 20.44C4.4957 20.5304 4.08904 20.8717 3.90809 21.3422C3.72809 21.8137 3.79857 22.3456 4.0957 22.75C4.1957 22.8871 6.05567 25.3556 10.0946 26.775C7.93754 27.509 4.97378 28.1944 1.42908 28.1944C0.869092 28.1944 0.359577 28.5289 0.128152 29.05C-0.104225 29.5711 -0.0156551 30.1826 0.353862 30.6124C0.507193 30.7922 4.22427 35 13.8098 35C29.7267 35 37.1428 19.916 37.1428 9.72222V9.23611C37.1428 9.09222 37.1275 8.95125 37.1218 8.80931C39.1142 6.84347 39.8637 5.36861 39.8999 5.29569C40.0798 4.92625 40.0132 4.48097 39.7322 4.18542Z" fill="black"/>
  </Icon>
)

function BurnButton({ token }){
  const { account } = useWeb3()
  const tokenBurnPrice = useBurnPrice()

  const { burn, burned, isBurning } = useBurn()

  if(!account || !addressEqual(account.address, token.owner)){
    return null
  }

  if(!tokenBurnPrice){
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
