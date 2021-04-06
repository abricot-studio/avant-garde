import { ActionButton, Center, Flex, Heading, Spinner, Text, Container, Box, VStack } from '../ui'
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

function Description() {
  return (
    <>
      <Heading
        textAlign="center"
        mb={8}
        fontSize={20}
      >Image generation</Heading>
      <Text align="justify">
        Abstract generative art with TensorFlow certified ownership on ethereum with nft. Using neuronal network architecture to output 3 values, defining RGB value for each pixel location. The Compositional pattern-producing network (CPPN) is composed of dense layers fully connected and activate by tangent hyperbolic. This network layer kernel bias are initialized with a determinist vector of initialisation derived from your ethereum address. Each pixel 2d coordinate vector get cross the network and output to rgb values.
        The final image is stored forever on IPFS. Get a unique abstract nft for your address.
      </Text>
    </>
  )
}

function priceFor(i){

  return Math.pow(i, 2) / 10000

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
    const currentPrice = priceFor(mintCounter)
    const dataPast = []
    const dataNext = []

    for(let i = 0; i <= mintCounter; i++){
      dataPast.push({
        x: i,
        y: priceFor(i)
      })
    }

    for(let i = mintCounter; i < mintCounter * 3; i++){
      dataNext.push({
        x: i,
        y: priceFor(i)
      })
    }

    return { dataPast, dataNext, mintCounter, currentPrice, isLoading: false}

  }, [fetching, tokenCountMint])

  return (
    <>
      <Heading
        textAlign="center"
        mb={8}
        fontSize={20}
      >Economics</Heading>

      <Text mb={4} align="justify">
        The blablac bonding curve
      </Text>

      {isLoading ?
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
                if (datum.x === 0) {
                  return null
                }
                if (datum.childName === 'linetNext' && datum.x === mintCounter) {
                  return null
                }

                if (['linetPast', 'linetNext'].includes(datum.childName)) {

                  return `Price: Ξ ${datum.y}\nMinted: ${datum.x}`
                }
                return null
              }}
              labelComponent={<VictoryTooltip
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
              />}
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
            x={370}
            y={235}
            style={{
              fontFamily: "Roboto Mono",
              fontSize: 15,
            }}
            text={"Minted"}
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
      }
    </>
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
        >What's this ?</Heading>
        <ImageFrame size={350} />
      </Flex>

      <Container
        maxW="container.sm"
        position="relative"
      >
        <Heading
          textAlign="center"
          mb={20}
        >What's this ?</Heading>

        <Description />
        <Box mt={4}>
          <Chart />
        </Box>
        {
          canMint &&
          <Center mt={8}>
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
