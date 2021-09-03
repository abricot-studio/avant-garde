import { useDisclosure } from '@chakra-ui/hooks'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { utils } from 'ethers'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { useHistory } from '../../hooks/history'
import { ChartPrice } from '../ChartPrice'
import { TokenImage } from '../tokens/TokenImage'
import {
  ActionButton,
  Box,
  Button,
  Card,
  Center,
  Collapse,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Link as CLink,
  Text,
  useBreakpointValue,
  VStack,
  Wrap,
  WrapItem,
} from '../ui'
import { Paragraph, SubTitle } from './About'
import Hero from './Hero'

export function Home() {
  const { minted, balancePool, holders, burned, tokens } = useHistory()
  const mobile = useBreakpointValue({ base: true, md: false, lg: false })
  const { isOpen: isOpenQ1, onToggle: onToggleQ1 } = useDisclosure()
  const { isOpen: isOpenQ2, onToggle: onToggleQ2 } = useDisclosure()
  const { isOpen: isOpenQ3, onToggle: onToggleQ3 } = useDisclosure()
  const { isOpen: isOpenQ4, onToggle: onToggleQ4 } = useDisclosure()
  const { isOpen: isOpenQ5, onToggle: onToggleQ5 } = useDisclosure()
  const { isOpen: isOpenQ6, onToggle: onToggleQ6 } = useDisclosure()
  const { isOpen: isOpenQ7, onToggle: onToggleQ7 } = useDisclosure()
  const { isOpen: isOpenQ8, onToggle: onToggleQ8 } = useDisclosure()
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
          <b>art creation</b>. It aims to link <b>blockchain and art</b>
          ecosystems to create <b>generative</b> and <b>abstract</b> pieces of
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
            store images on IPFS to guarantee ownership and availability
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
              Nowadays, most of NFTs projects enable you to buy a piece of art
              and sell it on the secondary market. At AvantGarde, we decided
              that it would be fairer for our collectors to control the market.
              Indeed, we created an Automated Market Maker where you can buy and
              sell your AvantGarde token 24/7. with a price updated in
              real-time.
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <Text fontWeight="500" fontSize={18} mt={2}>
              Bonding Curve
            </Text>
            <Text fontSize={12} mt={4}>
              What would be the value of an AI-generated artwork? That’s the
              question we wanted to answer when we decided to create a bonding
              curve that defines the price of AvantGarde tokens. Each time a
              token is minted, the price follows the curve and increases, and
              each time a token is burned, the price decreases. Thus, the price
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
              with NFTs. We created an immutable smart contract acting like a
              safe to guarantee your security: when you buy a token, your funds
              go into a token pool and are then used when an AvantGardist wants
              to burn his artwork. No worries, buy and sell at the right time
              and just take profits!
            </Text>
          </Flex>
        </WrapItem>
      </Wrap>
      <Heading
        as="h2"
        fontFamily="Poppins, sans-serif"
        textAlign="center"
        fontSize={{ base: '1.4rem', sm: '1.4em', md: '1.8rem' }}
        mt={40}
      >
        Newly minted
      </Heading>
      <Wrap spacing={20} justify="center" mx={0} mt={8}>
        {tokens &&
          tokens.slice(0, 3).map((token) => (
            <WrapItem flexDirection="column">
              <TokenImage avantGardeToken={token} size={200} noBurned={true} />
              <Card mt={8}>
                <Flex
                  justifyContent="center"
                  direction={mobile ? 'column' : 'row'}
                >
                  <Flex>
                    <HStack justifyContent="center">
                      <VStack justify="space-between" alignItems="center">
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
                          Ξ{' '}
                          {utils.formatEther(
                            utils.parseUnits(token.mintPrice, 'wei')
                          )}
                        </Box>
                      </VStack>
                    </HStack>
                  </Flex>
                </Flex>
              </Card>
            </WrapItem>
          ))}
      </Wrap>
      <Center mt={16}>
        <Link passHref href={`/gallery`}>
          <ActionButton as="a" w="12rem" textAlign="center">
            Explore Gallery
          </ActionButton>
        </Link>
      </Center>
      <Heading
        as="h2"
        fontFamily="Poppins, sans-serif"
        textAlign="center"
        fontSize={{ base: '1.4rem', sm: '1.4em', md: '1.8rem' }}
        mt={40}
      >
        Frequently Asked Questions
      </Heading>
      <Container w="90%" maxW="container.sm" position="relative">
        <Card mt={4} p={8}>
          <SubTitle>
            What is AvantGarde?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ1}>
              <FontAwesomeIcon
                icon={isOpenQ1 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ1} animateOpacity startingHeight={1}>
            <Paragraph>
              AvantGarde is an NFT experience created by the Abricot Studio that
              invites you to discover what deep-learning can bring to the art
              creation. It aims to link the blockchain and art excosystems to
              create generative and abstract piece of art, fully personalized
              and unique.
            </Paragraph>
          </Collapse>
          <SubTitle>
            Is it only one piece per wallet address?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ2}>
              <FontAwesomeIcon
                icon={isOpenQ2 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ2} animateOpacity startingHeight={1}>
            <Paragraph>
              You can generate only one AvantGarde artwork per wallet address.
              The reason is that the piece you're generating is not random, it's
              based on your address, so one address can generate only one unique
              piece. AvantGarde token market is ruled by a bonding curve, thus
              there is an infinite quantity that can be generated and minted.
            </Paragraph>
          </Collapse>
          <SubTitle>
            If i burn the art, can I mint a new one with the same address?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ3}>
              <FontAwesomeIcon
                icon={isOpenQ3 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ3} animateOpacity startingHeight={1}>
            <Paragraph>
              You can only generate and mint your AvantGarde token once. If you
              burn it, it’s destroyed forever.
            </Paragraph>
          </Collapse>
          <SubTitle>
            How much is the supply?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ4}>
              <FontAwesomeIcon
                icon={isOpenQ4 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ4} animateOpacity startingHeight={1}>
            <Paragraph>
              The supply is infinite but limited to one per wallet address, the
              bonding curve regulates the supply, the price is correlated to the
              supply.
            </Paragraph>
          </Collapse>
          <SubTitle>
            How much is the supply?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ4}>
              <FontAwesomeIcon
                icon={isOpenQ4 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ4} animateOpacity startingHeight={1}>
            <Paragraph>
              The supply is infinite but limited to one per wallet address, the
              bonding curve regulates the supply, the price is correlated to the
              supply.
            </Paragraph>
          </Collapse>
          <SubTitle>
            Does the Price go up each time?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ5}>
              <FontAwesomeIcon
                icon={isOpenQ5 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ5} animateOpacity startingHeight={1}>
            <Paragraph>
              Price is ruled by a bonding curve, thus it increases each time a
              token is minted. A bonding curve is a mathematical function
              defining a buy and sell price depending on the number of
              circulating tokens at a given moment. The more token are created,
              the higher get the price. When token are burned, the price goes
              down.
            </Paragraph>
          </Collapse>
          <SubTitle>
            What happens if I sell it on OpenSea?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ6}>
              <FontAwesomeIcon
                icon={isOpenQ6 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ6} animateOpacity startingHeight={1}>
            <Paragraph>
              You can sell your AvantGarde token on OpenSea as a secondary
              market sale. The artwork will be transferred, as any other NFT, to
              the buyer, with the ability to burn the token. You won’t be able
              to generate your token again and lose ownership. You can own as
              many AvantGarde tokens as you want but you can only generate one
              per wallet address.
            </Paragraph>
          </Collapse>
          <SubTitle>
            Why didn't you build a slippage mechanism?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ7}>
              <FontAwesomeIcon
                icon={isOpenQ7 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ7} animateOpacity startingHeight={1}>
            <Paragraph>
              Keep the application easy to use and guarantee security.
            </Paragraph>
          </Collapse>
          <SubTitle>
            Why do I need to verify my token on discord?
            <ActionButton px={0} size="xs" ml={4} onClick={onToggleQ8}>
              <FontAwesomeIcon
                icon={isOpenQ8 ? faArrowUp : faArrowDown}
                size="xs"
              />
            </ActionButton>
          </SubTitle>
          <Collapse in={isOpenQ8} animateOpacity startingHeight={1}>
            <Paragraph>
              Verifying your token on discord ables you to access the private
              AvantGardists chat on discord.
            </Paragraph>
          </Collapse>
        </Card>
      </Container>
      <Center mt={16}>
        <Link passHref href="/generator">
          <ActionButton as="a" w="12rem">
            Generate yours
          </ActionButton>
        </Link>
      </Center>
    </>
  )
}
