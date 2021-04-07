import { ActionButton, Center, Flex, Heading, Link as CLink, Spinner, Text, Container, Box, VStack } from '../ui'
import Link from 'next/link'
import React, { useMemo } from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryBar,
  VictoryScatter,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'
import { useCanMint, useTokenCountMint } from '../../hooks/tokens'
import { ImageFrame } from '../ui/TokenImage'
import { bondingCurveFn, contractConstants } from '../../lib/constants'

const Title = ({ children }) => (
  <Heading
    textAlign="center"
    mt={4}
    mb={4}
    fontSize={20}
  >
    {children}
  </Heading>
)
const SubTitle = ({ children }) => (
  <Heading
    textAlign="left"
    mt={4}
    ml={4}
    mb={2}
    fontSize={16}
  >
    {children}
  </Heading>
)
const Paragraph = ({ children }) => (
  <Text
    align="justify"
    mb={1}
    fontSize="md"
  >
    {children}
  </Text>
)

function Description() {
  return (
    <>
      <Paragraph>
        AvantGarde is a digital artwork platform.
      </Paragraph>
      <Paragraph>
        It relies on state-of-the-art technologies to computationally generate unique abstract art and sell it to collectors on decentralized blockchains.
      </Paragraph>

      <Title>Image generation</Title>
      <Paragraph>
        Images are automatically generated by deep-learning algorithms.
        It takes as input your wallet address and create a unique image as an output.
        No two images are similar.
      </Paragraph>
      <Paragraph>
        Under the hood, AvantGarde uses TensorFlow, using neural network architecture to output a matrix of 3 values, defining RGB color for each pixel location.
        The Compositional pattern-producing network (CPPN) is composed of dense layers fully connected and activated by tangent hyperbolic functions.
        This network layer kernel bias are initialized with a determinist vector of initialisation derived from your ethereum address. Each pixel 2d coordinate vector get across the network and output RGB values.
      </Paragraph>

      <Title>NFT minting</Title>
      <Paragraph>
        After our algorithms have generated your image, you need to mint it on the blockchain and become its owner. Only you can mint the unique image related to your address.
      </Paragraph>
      <Paragraph>
        You can then either parade it on social networks (like on <CLink href="https://opensea.io" isExternal>Opensea</CLink> or <CLink href="https://tryshowtime.com" isExternal>Showtime</CLink>), trade it on secondary markets, or burn it here.
      </Paragraph>
      <Paragraph>
        With AvantGarde, you art will be forever available online! Ownership is stored on a decentralized ledger and the image on <CLink href="https://ipfs.io" isExternal>IPFS</CLink>.
      </Paragraph>

      <Title>Economics</Title>
      <Paragraph>
        Images can be minted and burned on the blockchain, depending on a price defined by a bonding curve.
      </Paragraph>

      <SubTitle>Bonding curve</SubTitle>
      <Paragraph>
        A bonding curve is a mathematical function defining a buy and sell price depending on the number of tokens existing at a given moment.
        The more token are created, the higher get the price. When token are burned, the price goes down.
      </Paragraph>
      <SubTitle>Minting</SubTitle>
      <Paragraph>
        In order to get a copy of your art on the blockchain, you have to pay the price defined by the bonding curve at the time of minting.
        There is an additional platform fee of {contractConstants.platformFees * 100}% to support the creators of this project.
      </Paragraph>

      <SubTitle>Burning</SubTitle>
      <Paragraph>
        In addition to the secondary market, token holders can come anytime on this app and sell their token at the price defined by the bonding curve. Our Smart-Contracts acts as an Automated Market Maker, and always has enough funds to re-buy your art, which comes from mint fees.
      </Paragraph>

      <SubTitle>Rationale</SubTitle>
      <Paragraph>
        Bonding curves are a novel and quite interesting economic mechanism. If you want to learn more about them, we suggest you to read more about them there.
        <br/>
        Regarding platform fees, some may say they are usually paid at burning time. We decided to put them at minting because we don't want to incite people to burn their while still want to rewards the artists.
      </Paragraph>

      <SubTitle>Chart</SubTitle>
      <Chart />
    </>
  )
}

function Chart(){
  const { tokenCountMint, fetching } = useTokenCountMint()

  const { dataPast, dataNext, mintCounter, currentPrice, isLoading } = useMemo( () => {
    if(fetching || !tokenCountMint){
      return {
        dataPast: [],
        dataNext: [],
        mintCounter: 0,
        currentPrice: 0,
        isLoading: true
      }
    }
    const mintCounter = Number(tokenCountMint.current)
    const currentPrice = bondingCurveFn(mintCounter)
    const dataPast = []
    const dataNext = []

    for(let i = 0; i <= mintCounter; i++){
      dataPast.push({
        x: i,
        y: bondingCurveFn(i)
      })
    }

    for(let i = mintCounter; i < mintCounter * 3; i++){
      dataNext.push({
        x: i,
        y: bondingCurveFn(i)
      })
    }

    return { dataPast, dataNext, mintCounter, currentPrice, isLoading: false }
  }, [fetching, tokenCountMint])

  return (
    isLoading ?
      <VStack align="center">
        <Text textStyle="caption" mb={4}>
          Loading chart...
        </Text>
        <Spinner size="lg"/>
      </VStack>
      :
      <VictoryChart
        domain={{x: [0, dataNext[dataNext.length - 1].x], y: [0, dataNext[dataNext.length - 1].y]}}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension="x"
            labels={({datum}) => {
              if (datum.childName === 'linetNext' && datum.x === mintCounter) {
                return null
              }

              if (['linetPast', 'linetNext'].includes(datum.childName)) {
                return `
                    Minted: ${datum.x}
                    Mint Price: Ξ ${bondingCurveFn(datum.x + 1)}
                    ${datum.x !== 0 ? `Burn Price: Ξ ${datum.y}` : ''}
                  `
              }
              return null
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={0}
                style={{
                  fontFamily: "Roboto Mono",
                  letterSpacing: "-3%",
                  fontSize: 7,
                  fontWeight: 500,
                }}
                flyoutStyle={{
                  fill: "white",
                }}
              />
            }
          />
        }
      >
        <VictoryLabel
          x={330}
          y={40}
          style={{
            fontFamily: "Roboto Mono",
            fontSize: 15,
            borderBottom: "1px solid black"
          }}
          text={"x²"}
        />
        <VictoryLine
          name="formulaUnderscore"
          style={{
            data: {
              stroke: "black",
              strokeWidth: 2,
            }
          }}
          data={[
            {
              x: dataNext[dataNext.length - 1].x - (dataNext[dataNext.length - 1].x * 0.25),
              y: dataNext[dataNext.length - 1].y
            },
            {
              x: dataNext[dataNext.length - 1].x - (dataNext[dataNext.length - 1].x * 0.11),
              y: dataNext[dataNext.length - 1].y
            },
          ]}
          x="x"
          y="y"
        />
        <VictoryLabel
          x={315}
          y={60}
          style={{
            fontFamily: "Roboto Mono",
            fontSize: 15,
            borderBottom: "1px solid black"
          }}
          text={"10000"}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(y) => (`Ξ ${y}`)}
          style={{
            tickLabels: {
              fontFamily: "Roboto Mono",
              fontSize: 8,
            },
          }}
        />
        <VictoryLabel
          x={30}
          y={30}
          style={{
            fontFamily: "Roboto Mono",
            fontSize: 15,
          }}
          text={"Price"}
        />
        <VictoryAxis
          tickFormat={(x) => x}
          style={{
            tickLabels: {
              fontFamily: "Roboto Mono",
              fontSize: 10,
            },
            axisLabel: {
              fontFamily: "Roboto Mono",
              fontSize: 15,
            },
          }}
        />
        <VictoryLabel
          x={280}
          y={235}
          style={{
            fontFamily: "Roboto Mono",
            fontSize: 15,
          }}
          text={"Tokens minted"}
        />

        <VictoryLine
          name="linetPast"
          interpolation="natural"
          style={{
            data: {
              stroke: "#00FFC2",
              strokeWidth: 2,
            }
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
              stroke: "#00FFC2",
              strokeWidth: 2,
              strokeDasharray: "10,5"
            }
          }}
          data={dataNext}
          x="x"
          y="y"
        />

        <VictoryScatter
          name="currentPoint"
          style={{
            data: {
              fill: "red",
            },
            labels: {
              fontFamily: "Roboto Mono",
              fontSize: 15, fill: "#c43a31", padding: 8
            }
          }}
          size={5}
          data={[{x: mintCounter, y: currentPrice}]}
          x="x"
          y="y"
          labels={({datum}) => datum.x}
        />
        <VictoryLine
          name="currentHLine"
          style={{
            data: {stroke: "red", width: 5}
          }}
          labelComponent={
            <VictoryLabel
              verticalAnchor="middle"
              textAnchor="start"
              x={60}
              style={{
                fontFamily: "Roboto Mono",
                fontSize: 12
              }}
            />
          }
          labels={({datum}) => datum.x}
          data={[
            {x: 0, y: currentPrice, label: currentPrice},
            {x: mintCounter, y: currentPrice, label: ''}
          ]}
        />
        <VictoryBar
          name="currentVLine"
          style={{
            data: {
              fill: "red",
              width: 3
            }
          }}

          data={[{x: mintCounter, y: currentPrice}]}
          x="x"
          y="y"
        />

      </VictoryChart>
  )
}

export function About() {
  const canMint = useCanMint();

  return (
    <Box
      position="relative"
    >
      <Flex
        position="absolute"
        direction="column"
        align="center"
        w="100%"
        opacity="0.6"
      >
        <Heading
          color="transparent"
          mb={8}
        >TRANSPARENT</Heading>
        <ImageFrame size={350} />
      </Flex>

      <Container
        maxW="container.sm"
        position="relative"
      >
        <Heading
          textAlign="center"
          mb={8}
        >What's this ?</Heading>

        <Description />
        {
          canMint &&
          <Center my={8}>
            <Link passHref href="/generator">
              <ActionButton
                as="a"
              >Generate yours</ActionButton>
            </Link>
          </Center>
        }
      </Container>
    </Box>
  )
}
