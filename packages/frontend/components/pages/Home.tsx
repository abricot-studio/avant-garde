import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import { useHistory } from '../../hooks/history'
import { ChartPrice } from '../ChartPrice'
import {
  ActionButton,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link as CLink,
  Text,
  Wrap,
  WrapItem,
} from '../ui'
import Hero from './Hero'

export function Home() {
  const { minted, balancePool, holders, burned } = useHistory()
  return (
    <>
      <Heading color="transparent" mb={8} fontFamily="Poppins, sans-serif">
        Home
      </Heading>
      <Hero />
      <Wrap spacing={4} justify="center" mx={12}>
        <WrapItem alignItems="center">
          <Flex flexDirection="column" alignItems="center" mx={4}>
            <Box fontWeight={700} fontSize={32}>
              {minted}
            </Box>
            <Box fontWeight="400">Minted</Box>
          </Flex>
          <Flex flexDirection="column" alignItems="center" mx={4}>
            <Box fontWeight={700} fontSize={32}>
              Ξ {balancePool}
            </Box>
            <Box fontWeight="400">Pool</Box>
          </Flex>
        </WrapItem>
        <WrapItem alignItems="center">
          <Flex flexDirection="column" alignItems="center" mx={4}>
            <Box fontWeight={700} fontSize={32}>
              {holders}
            </Box>
            <Box fontWeight="400">Holders</Box>
          </Flex>
          <Flex flexDirection="column" alignItems="center" mx={4}>
            <Box fontWeight={700} fontSize={32}>
              {burned}
            </Box>
            <Box fontWeight="400">Burned</Box>
          </Flex>
        </WrapItem>
      </Wrap>
      <Center mt={8} id="image-generation">
        <CLink href="#image-generation">
          <ActionButton px={0}>
            <FontAwesomeIcon icon={faArrowDown} size="1x" />
          </ActionButton>
        </CLink>
      </Center>
      <Flex
        justifyContent="center"
        mt={32}
        flexDirection="column"
        alignItems="center"
        mx={{ base: 18, sm: 8, md: 18 }}
      >
        <Heading
          as="h2"
          fontFamily="Poppins, sans-serif"
          textAlign="center"
          fontSize={{ base: '1.4rem', sm: '1.4em', md: '1.8rem' }}
        >
          When deep-learning meets art
        </Heading>
        <Text mx={{ sm: 4, md: 24 }} textAlign="center" mt={4}>
          <b>AvantGarde</b> is an NFT experience created by the Abricot Studio
          that invites you to discover what <b>deep-learning</b> can bring to
          the <b>art creation</b>. It aims to link <b>blockchain and art</b>{' '}
          ecosystems to create <b>generative</b> and <b>abstract</b> piece of
          art, fully <b>personalized and unique</b>.
        </Text>
      </Flex>
      <Wrap spacing={20} justify="center" mx={12} mt={12}>
        <WrapItem alignItems="center" flexDirection="column">
          <Image src="./uniqueness.svg" boxSize={36} />
          <Text fontWeight="500" fontSize={18} mt={2}>
            Uniqueness
          </Text>
          <Text
            w={{ sm: '100%', md: 56 }}
            fontSize={14}
            textAlign="center"
            mt={4}
          >
            Each AvantGarde NFT is unique and generated based on your Ethereum
            address with a deep-learning algorithm. No two images are the same.
          </Text>
        </WrapItem>
        <WrapItem alignItems="center" flexDirection="column">
          <Image src="./decentralization.svg" boxSize={36} />
          <Text fontWeight="500" fontSize={18} mt={2}>
            Decentralization
          </Text>
          <Text
            w={{ sm: '100%', md: 56 }}
            fontSize={14}
            textAlign="center"
            mt={4}
          >
            Your artwork will last forever. We use a decentralized ledger and
            store images on IPFS to guanratee ownership and availability
            whatever happens.
          </Text>
        </WrapItem>
        <WrapItem alignItems="center" flexDirection="column">
          <Image src="./generation.svg" boxSize={36} />
          <Text fontWeight="500" fontSize={18} mt={2}>
            Image Generation
          </Text>
          <Text
            w={{ sm: '100%', md: 56 }}
            fontSize={14}
            textAlign="center"
            mt={4}
          >
            AvantGarde uses TensorFlow, a neural network architecture to output
            a matrix of 3 values, defining RGB color for each pixel location.
          </Text>
        </WrapItem>
      </Wrap>
      <Center>
        <Link passHref href="/about">
          <Button
            as="a"
            variant="outline"
            borderRadius="full"
            border="2px"
            borderColor="reddy"
            bgColor="white"
            px={12}
            rounded="full"
            _hover={{}}
            mt={8}
            w="12rem"
          >
            Learn more
          </Button>
        </Link>
      </Center>
      <Heading
        as="h2"
        fontFamily="Poppins, sans-serif"
        textAlign="center"
        fontSize={{ base: '1.4rem', sm: '1.4em', md: '1.8rem' }}
        mt={40}
      >
        A new way for collecting NFTs
      </Heading>
      <Wrap spacing={12} justify="center" mx={12} mt={8}>
        <WrapItem
          alignItems="center"
          justify="center"
          justifyContent="center"
          flexDirection="column"
        >
          <ChartPrice />
        </WrapItem>
        <WrapItem flexDirection="column" w={{ sm: '100%', md: '30%' }}>
          <Flex flexDirection="column">
            <Text fontWeight="500" fontSize={18} mt={2}>
              Automated Market Maker
            </Text>
            <Text fontSize={12} mt={4}>
              Nowadays, the Nft most of NFTs projects enable you to buy piece of
              art and sell it on the secondary market. At AvantGarde, we decided
              that it would be more fair for our collectors to control the
              market. Indeed, we created an Automated Market Maker where you can
              buy and sell your AvantGarde token 24/7. with a price updated in
              real time.{' '}
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <Text fontWeight="500" fontSize={18} mt={2}>
              Bonding Curve
            </Text>
            <Text fontSize={12} mt={4}>
              What woyld be the value of a AI generated artwork? That’s the
              question we wanted to answer when we decided to create a bnding
              curve that defines the price of AvantGarde tokens. Each time a
              token is minted, the price follows the curve and increases, and
              each time a token is burned, the price dicreases. Thus, the price
              is defined by the number of circulating tokens and tends towards
              balance.
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <Text fontWeight="500" fontSize={18} mt={2}>
              Stay Safe and Sound
            </Text>
            <Text fontSize={12} mt={4}>
              The purpose of AvantGarde is to create a trading-like experience
              with NFTs. To guarantee your security, we created an immutable
              smart-contract acting like a safe: when you buy a token, your
              funds go into a token pool and are then used when an AvantGardist
              wants to burn his artwork. No worries, buy and sell at the right
              time and just take profits!
            </Text>
          </Flex>
        </WrapItem>
      </Wrap>
    </>
  )
}
