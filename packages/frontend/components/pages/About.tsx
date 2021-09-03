import { useDisclosure } from '@chakra-ui/hooks'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useMemo } from 'react'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'
import config from '../../config'
import { useCanMint, useTokenTotalSupply } from '../../hooks/mint'
import { bondingCurveFn, contractConstants } from '../../lib/constants'
import { ImageFrame } from '../tokens/TokenImage'
import {
  ActionButton,
  Box,
  Card,
  Center,
  Collapse,
  Container,
  Flex,
  Heading,
  Image,
  Link as CLink,
  Spinner,
  Text,
  VStack,
} from '../ui'

const DynamicMathComponent = dynamic(
  () => import('mathjax-react').then((mathjax) => mathjax.MathComponent),
  { ssr: false }
) as typeof import('mathjax-react').MathComponent

const Title = ({ children, ...props }) => (
  <Heading
    textAlign="center"
    mt={16}
    mb={4}
    fontSize={24}
    fontFamily="Poppins, sans-serif"
    {...props}
  >
    {children}
  </Heading>
)
export const SubTitle = ({ children }) => (
  <Heading
    textAlign="left"
    mt={4}
    mb={2}
    fontSize={16}
    fontFamily="Poppins, sans-serif"
  >
    {children}
  </Heading>
)
export const Paragraph = ({ children, ...props }) => (
  <Text
    align="justify"
    pb={1}
    fontSize={14}
    lineHeight={1.7}
    fontFamily="Poppins, sans-serif"
    {...props}
  >
    {children}
  </Text>
)

function Description() {
  const { isOpen: isOpenBondingCurve, onToggle: onToggleBondingCurve } =
    useDisclosure({ defaultIsOpen: true })
  const { isOpen: isOpenMinting, onToggle: onToggleMinting } = useDisclosure()
  const { isOpen: isOpenBurning, onToggle: onToggleBurning } = useDisclosure()
  const { isOpen: isOpenRational, onToggle: onToggleRational } = useDisclosure()
  const { isOpen: isOpenChart, onToggle: onToggleChart } = useDisclosure()

  return (
    <>
      <Center mt={8} id="image-generation">
        <CLink href="#image-generation">
          <ActionButton px={0}>
            <FontAwesomeIcon icon={faArrowDown} size="1x" />
          </ActionButton>
        </CLink>
      </Center>

      <Title>Deep-learning based image generation</Title>

      <Card mt={8} p={8}>
        <Paragraph>
          A deep learning algorithm generates images automatically. The
          algorithm uses your wallet address as input and creates a unique image
          as output.
        </Paragraph>
        <Paragraph pt={4}>
          In the background, AvantGarde uses neural network architecture
          supported by{' '}
          <CLink
            href="https://www.tensorflow.org"
            color="#6B93FB"
            isExternal
            _active={{}}
            _focus={{}}
          >
            TensorFlow
          </CLink>
          , to generate the output, a matrix of three values, defining RGB
          colours for each pixel location. The Compositional pattern-producing
          network (CPPN) consists of dense, fully connected layers, activated by
          tangent, hyperbolic functions. This network layer kernel bias gets
          initialized by a deterministic vector derived from your Ethereum
          address. Each pixel 2d coordinate vector gets across the network and
          outputs RGB values.
        </Paragraph>
        <Image src="./generation_schema.svg" boxSize="100%" />
      </Card>

      <Title>That gets minted in a click</Title>
      <Card mt={8} p={8}>
        <Paragraph>
          After our algorithm has generated your image, you need to mint it on
          the blockchain to become its owner. Only you can mint the unique image
          related to your address.
        </Paragraph>
        <Paragraph pt={4}>
          You can then either list it on marketplaces (like on{' '}
          <CLink
            href="https://opensea.io"
            color="#6B93FB"
            isExternal
            _active={{}}
            _focus={{}}
          >
            Opensea
          </CLink>{' '}
          or on{' '}
          <CLink
            href="https://tryshowtime.com"
            color="#6B93FB"
            isExternal
            _active={{}}
            _focus={{}}
          >
            Showtime
          </CLink>
          ), trade it on secondary markets, or burn it at AvantGarde.
        </Paragraph>
        <Paragraph pt={4}>
          With AvantGarde, your art will be forever available online! Ownership
          is stored on a decentralized ledger and your image is stored on{' '}
          <CLink
            href="https://docs.ipfs.io/concepts/what-is-ipfs"
            color="#6B93FB"
            isExternal
            _active={{}}
            _focus={{}}
          >
            IPFS
          </CLink>
          .
        </Paragraph>
      </Card>

      <Title>With economics that will react to mint & burn</Title>
      <Card mt={4} p={8}>
        <Paragraph>
          Images can be minted and burned on the blockchain, depending on a
          price defined by a bonding curve.
        </Paragraph>

        <SubTitle>
          Bonding curve
          <ActionButton px={0} size="xs" ml={4} onClick={onToggleBondingCurve}>
            <FontAwesomeIcon
              icon={isOpenBondingCurve ? faArrowUp : faArrowDown}
              size="xs"
            />
          </ActionButton>
        </SubTitle>
        <Collapse in={isOpenBondingCurve} animateOpacity startingHeight={1}>
          <Paragraph>
            A bonding curve is a mathematical function that defines a buying and
            selling price depending on the number of circulating tokens at a
            given moment. The more tokens created, the higher the price gets.
            When tokens are burned, the price goes down.
          </Paragraph>
        </Collapse>
        <SubTitle>
          Minting
          <ActionButton px={0} size="xs" ml={4} onClick={onToggleMinting}>
            <FontAwesomeIcon
              icon={isOpenMinting ? faArrowUp : faArrowDown}
              size="xs"
            />
          </ActionButton>
        </SubTitle>
        <Collapse in={isOpenMinting} animateOpacity startingHeight={1}>
          <Paragraph>
            In order to get a copy of your art on the blockchain, you have to
            pay the price defined by the bonding curve at the time of minting.
            There is an additional platform fee of{' '}
            {contractConstants.platformFees * 100}% to support the creators of
            this project.
          </Paragraph>
        </Collapse>

        <SubTitle>
          Burning
          <ActionButton px={0} size="xs" ml={4} onClick={onToggleBurning}>
            <FontAwesomeIcon
              icon={isOpenBurning ? faArrowUp : faArrowDown}
              size="xs"
            />
          </ActionButton>
        </SubTitle>
        <Collapse in={isOpenBurning} animateOpacity startingHeight={1}>
          <Paragraph>
            In addition to the secondary market, token holders can return to
            AvantGarde anytime and sell their tokens at a price defined by the
            bonding curve. Our smart contract acts as an Automated Market Maker,
            and always has enough funds to re-buy your art.
          </Paragraph>
          <Paragraph pt={4}>
            If the number of circulating tokens goes up after you mint your
            token, you can make a profit by selling it.
          </Paragraph>
        </Collapse>

        <SubTitle>
          Rationale
          <ActionButton px={0} size="xs" ml={4} onClick={onToggleRational}>
            <FontAwesomeIcon
              icon={isOpenRational ? faArrowUp : faArrowDown}
              size="xs"
            />
          </ActionButton>
        </SubTitle>
        <Collapse in={isOpenRational} animateOpacity startingHeight={1}>
          <Paragraph>
            Bonding curves are a novel and quite interesting economic mechanism.
            If you are interested in this concept, we suggest you read more
            about this by clicking{' '}
            <CLink
              href="https://hackernoon.com/what-are-bonding-curve-offerings-xi2k34bm"
              color="#6B93FB"
              isExternal
              _active={{}}
              _focus={{}}
            >
              here
            </CLink>
            .
          </Paragraph>
          <Paragraph pt={4}>
            Regarding platform fees, some may claim that fees should be charged
            at the burning stage. We decided to introduce them at the minting
            stage as we do not want to invite people to burn art, while we still
            want to reward artists.
          </Paragraph>
        </Collapse>
        <SubTitle>
          Chart
          <ActionButton px={0} size="xs" ml={4} onClick={onToggleChart}>
            <FontAwesomeIcon
              icon={isOpenChart ? faArrowUp : faArrowDown}
              size="xs"
            />
          </ActionButton>
        </SubTitle>
        <Collapse in={isOpenChart} animateOpacity startingHeight={1}>
          <Chart />
        </Collapse>
      </Card>
    </>
  )
}

function Chart() {
  const tokenTotalSupply = useTokenTotalSupply()

  const { dataPast, dataNext, mintCounter, currentPrice, isLoading } =
    useMemo(() => {
      if (!tokenTotalSupply && !config.whitelistMode) {
        return {
          dataPast: [],
          dataNext: [],
          mintCounter: 0,
          currentPrice: 0,
          isLoading: true,
        }
      }
      const mintCounter =
        tokenTotalSupply && !config.whitelistMode
          ? Number(tokenTotalSupply.current)
          : 0
      const currentPrice = !config.whitelistMode
        ? bondingCurveFn(mintCounter)
        : 0
      const dataPast = []
      const dataNext = []

      for (let i = 0; i <= mintCounter; i++) {
        dataPast.push({
          x: i,
          y: bondingCurveFn(i),
        })
      }

      const iMax = !config.whitelistMode ? mintCounter * 3 : 100
      for (let i = mintCounter; i < iMax; i++) {
        dataNext.push({
          x: i,
          y: bondingCurveFn(i),
        })
      }

      return { dataPast, dataNext, mintCounter, currentPrice, isLoading: false }
    }, [tokenTotalSupply])

  return isLoading || dataNext.length === 0 ? (
    <VStack align="center">
      <Text textStyle="caption" pb={4}>
        Loading chart...
      </Text>
      <Spinner size="lg" />
    </VStack>
  ) : (
    <Box>
      <Center>
        <DynamicMathComponent tex={String.raw`f(x) = \frac{x^2}{10000}`} />
      </Center>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="myGradient1">
            <stop offset="0%" stopColor="hsl(224, 85%, 66%)" />
            <stop offset="25%" stopColor="hsl(269, 85%, 66%)" />
            <stop offset="50%" stopColor="hsl(314, 85%, 66%)" />
            <stop offset="100%" stopColor="hsl(359, 85%, 66%)" />
          </linearGradient>
          <linearGradient id="myGradient2">
            <stop offset="0%" stopColor="hsl(359, 85%, 66%)" />
            <stop offset="25%" stopColor="hsl(44, 85%, 66%)" />
            <stop offset="50%" stopColor="hsl(89, 85%, 66%)" />
            <stop offset="75%" stopColor="hsl(134, 85%, 66%)" />
            <stop offset="100%" stopColor="hsl(179, 85%, 66%)" />
          </linearGradient>
        </defs>
      </svg>
      <VictoryChart
        padding={{ top: 0, bottom: 20, left: 50, right: 0 }}
        domain={{
          x: [0, dataNext[dataNext.length - 1].x * 1.1],
          y: [0, dataNext[dataNext.length - 1].y * 1.1],
        }}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension="x"
            labels={({ datum }) => {
              if (
                (datum.childName === 'linetNext' && datum.x === mintCounter) ||
                datum.x === 0
              ) {
                return null
              }

              if (['linetPast', 'linetNext'].includes(datum.childName)) {
                return `# Circulating: ${datum.x}
                    
                    Mint Price: Ξ ${bondingCurveFn(datum.x + 1)}
                    
                    ${datum.x !== 0 ? `Burn Price: Ξ ${datum.y}` : ''}`
              }
              return null
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={5}
                pointerLength={5}
                style={{
                  fontFamily: 'Roboto Mono',
                  fontSize: 7,
                  fill: 'white',
                  fontWeight: 500,
                }}
                flyoutStyle={{
                  fill: '#6B93FB',
                  stroke: '#6B93FB',
                }}
              />
            }
          />
        }
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(y) => `Ξ ${y}`}
          style={{
            tickLabels: {
              fontFamily: 'Roboto Mono',
              fontSize: 8,
            },
          }}
        />
        <VictoryLabel
          x={60}
          y={60}
          style={{
            fontFamily: 'Roboto Mono',
            fontWeight: 400,
            fontSize: 12,
          }}
          text={'Price'}
        />
        <VictoryLabel
          x={60}
          y={75}
          style={{
            fontFamily: 'Roboto Mono',
            fill: '#6B93FB',
            fontSize: 11,
          }}
          text={`Current Ξ ${currentPrice}`}
        />
        <VictoryAxis
          tickFormat={(x) => x}
          style={{
            tickLabels: {
              fontFamily: 'Roboto Mono',
              fontSize: 10,
            },
            axisLabel: {
              fontFamily: 'Roboto Mono',
              fontSize: 15,
            },
          }}
        />
        <VictoryLabel
          x={272}
          y={235}
          style={{
            fontFamily: 'Roboto Mono',
            fontWeight: 400,
            fontSize: 12,
          }}
          text={'Circulating tokens'}
        />
        <VictoryLabel
          x={342}
          y={220}
          style={{
            fontFamily: 'Roboto Mono',
            fill: '#6B93FB',
            fontSize: 11,
          }}
          text={`Current ${mintCounter}`}
        />

        <VictoryLine
          name="linetPast"
          interpolation="natural"
          style={{
            data: {
              stroke: 'url(#myGradient1)',
              strokeWidth: 2,
            },
          }}
          data={dataPast}
          x="x"
          y="y"
        />
        <VictoryLine
          name="linetNext"
          interpolation="natural"
          style={{
            data: {
              stroke: 'url(#myGradient2)',
              strokeWidth: 2,
              strokeDasharray: '10,5',
            },
          }}
          data={dataNext}
          x="x"
          y="y"
        />
        {!config.whitelistMode && (
          <VictoryScatter
            name="currentPoint"
            style={{
              data: {
                fill: '#6B93FB',
              },
            }}
            size={5}
            data={[{ x: mintCounter, y: currentPrice }]}
            x="x"
            y="y"
            labels={({ datum }) => ''}
          />
        )}
        {!config.whitelistMode && (
          <VictoryLine
            name="currentHLine"
            style={{
              data: {
                stroke: '#6B93FB',
                strokeWidth: 1,
              },
            }}
            data={[
              { x: 0, y: currentPrice, label: '' },
              { x: mintCounter, y: currentPrice, label: '' },
            ]}
          />
        )}
        {!config.whitelistMode && (
          <VictoryBar
            name="currentVLine"
            style={{
              data: {
                width: 1,
                fill: '#6B93FB',
              },
            }}
            data={[{ x: mintCounter, y: currentPrice }]}
            x="x"
            y="y"
          />
        )}
      </VictoryChart>
    </Box>
  )
}

export function About() {
  const canMint = useCanMint()

  return (
    <Box position="relative">
      <Heading
        textAlign="center"
        fontFamily="Poppins, sans-serif"
        mb={8}
        px={4}
        as="h1"
      >
        We generate unique images with AI, but how?
      </Heading>
      <Flex direction="column" align="center" w="100%" opacity="0.6">
        <ImageFrame size={350} isQuestion />
      </Flex>

      <Container w="90%" maxW="container.sm" position="relative">
        <Description />

        <Center my={8}>
          {!config.whitelistMode && canMint && (
            <Link passHref href="/generator">
              <ActionButton as="a">Generate yours</ActionButton>
            </Link>
          )}
          {!config.whitelistMode && !canMint && (
            <Link passHref href="/gallery">
              <ActionButton as="a" w="12rem">
                Gallery
              </ActionButton>
            </Link>
          )}
          {config.whitelistMode && (
            <Link passHref href="/register">
              <ActionButton as="a" w="12rem">
                Register
              </ActionButton>
            </Link>
          )}
        </Center>
      </Container>
    </Box>
  )
}
