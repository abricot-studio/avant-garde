import { utils } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import moment from 'moment'
import React from 'react'
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryClipContainer,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'
import { useBurnPrice } from '../hooks/burn'
import { useHistory } from '../hooks/history'
import { useMintPrice } from '../hooks/mint'
import { Box, Card, Spinner, Text, VStack, Wrap, WrapItem } from './ui'

function Chart() {
  const { tokens } = useHistory()
  const data =
    (tokens &&
      tokens
        .map((token) => ({
          x: new Date(parseInt(token.mintTimestamp) * 1000),
          y: parseFloat(formatEther(token.mintPrice).toString()),
        }))
        .sort((a, b) => (a.x < b.x ? -1 : 1))) ||
    []
  return data.length === 0 ? (
    <VStack align="center">
      <Text textStyle="caption" pb={4}>
        Loading chart...
      </Text>
      <Spinner size="lg" />
    </VStack>
  ) : (
    <Box>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="gradientLine">
            <stop offset="0%" stopColor="hsl(50, 95%, 70%, 1)" />
            <stop offset="50%" stopColor="hsl(0, 95%, 70%, 1)" />
            <stop offset="100%" stopColor="hsl(274, 95%, 70%, 1)" />
          </linearGradient>
          <linearGradient id="gradientArea" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="hsl(274, 95%, 70%, 0.3)" />
            <stop offset="33%" stopColor="hsl(0, 95%, 70%, 0.21)" />
            <stop offset="66%" stopColor="hsl(50, 95%, 70%, 0.11)" />
            <stop offset="100%" stopColor="hsl(50, 95%, 70%, 0)" />
          </linearGradient>
        </defs>
      </svg>
      <VictoryChart
        width={500}
        height={250}
        padding={{ top: 10, bottom: 40, left: 50, right: 0 }}
        domain={{
          x: [
            new Date(data[0].x.getTime() - 1000 * 3600 * 24),
            data[data.length - 1].x,
          ],
          y: [0, Math.max(...data.map((d) => d.y)) * 1],
        }}
        scale={{ x: 'time', y: 'linear' }}
        containerComponent={
          <VictoryVoronoiContainer
            // voronoiDimension="x"
            mouseFollowTooltips
            labels={({ datum }) => {
              return `${moment(datum.x).format('YYYYMMMDD').toUpperCase()}
              Ξ ${Math.floor(datum.y * 1000) / 1000}`
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={5}
                pointerLength={5}
                style={{
                  fontFamily: 'Roboto Mono',
                  fontSize: 10,
                  fill: 'rgba(0, 0, 0, 0.5)',
                  fontWeight: 500,
                }}
                flyoutStyle={{
                  fill: 'white',
                  stroke: 'url(#gradientLine)',
                }}
              />
            }
          />
          // <VictoryCursorContainer
          //   cursorDimension="x"
          //   cursorLabel={({ datum }: any) => {
          //     console.log(datum)
          //     return `${moment(datum.x).format('YYYYMMMDD').toUpperCase()}
          //       ${Math.floor(datum.y * 1000) / 1000}`
          //   }}
          //   cursorComponent={<LineSegment style={{ stroke: 'blue' }} />}
          //   cursorLabelComponent={
          //     <VictoryTooltip
          //       cornerRadius={5}
          //       pointerLength={5}
          //       style={{
          //         fontFamily: 'Roboto Mono',
          //         fontSize: 10,
          //         fill: 'white',
          //         fontWeight: 500,
          //       }}
          //       flyoutStyle={{
          //         fill: '#6B93FB',
          //         stroke: '#6B93FB',
          //       }}
          //     />
          //   }
          // />
        }
      >
        <VictoryAxis
          dependentAxis
          tickCount={5}
          tickFormat={(y) => `Ξ ${y}`}
          style={{
            tickLabels: {
              fill: 'rgba(0, 0, 0, 0.5)',
              fontFamily: 'Roboto Mono',
              fontSize: 12,
            },
            axis: {
              stroke: 0,
            },
          }}
        />
        <VictoryAxis
          tickCount={4}
          style={{
            tickLabels: {
              fill: 'rgba(0, 0, 0, 0.5)',
              fontFamily: 'Poppins',
              fontSize: 12,
            },
            axis: {
              stroke: 0,
            },
          }}
        />
        <VictoryArea
          groupComponent={<VictoryClipContainer clipPadding={{ top: 5 }} />}
          style={{
            data: {
              stroke: 'url(#gradientLine)',
              strokeWidth: 4,
              strokeLinecap: 'round',
              fill: 'url(#gradientArea)',
            },
          }}
          data={data}
          interpolation="monotoneX"
        />
        {/*<VictoryLine*/}
        {/*  name="line"*/}
        {/*  // interpolation="bundle"*/}
        {/*  // interpolation="basis"*/}
        {/*  interpolation="monotoneX"*/}
        {/*  style={{*/}
        {/*    data: {*/}
        {/*      stroke: 'url(#myGradient1)',*/}
        {/*      strokeWidth: 2,*/}
        {/*    },*/}
        {/*  }}*/}
        {/*  data={data}*/}
        {/*  x="x"*/}
        {/*  y="y"*/}
        {/*/>*/}
      </VictoryChart>
    </Box>
  )
}

export function ChartPrice() {
  const tokenMintPrice = useMintPrice()
  const tokenBurnPrice = useBurnPrice()

  return (
    <Card rounded={30} boxShadow="xl">
      <Wrap spacing={4}>
        <WrapItem>
          <Text color="rgba(0, 0, 0, 0.5)" fontSize={14} pl={2}>
            Current
          </Text>
        </WrapItem>
        <WrapItem>
          <Text fontWeight="700" fontSize={{ base: 10, sm: 14, md: 14 }} pl={2}>
            ⛏ Mint Price
          </Text>
          {tokenMintPrice && (
            <Text fontSize={{ base: 10, sm: 14, md: 14 }} pl={2}>
              Ξ{' '}
              {utils.formatEther(
                utils.parseUnits(tokenMintPrice.currentPrice, 'wei')
              )}
            </Text>
          )}
          <Text fontWeight="700" fontSize={{ base: 10, sm: 14, md: 14 }} pl={4}>
            🔥 Burn Price
          </Text>
          {tokenBurnPrice && (
            <Text fontSize={{ base: 10, sm: 14, md: 14 }} pl={2}>
              {' '}
              Ξ{' '}
              {utils.formatEther(
                utils.parseUnits(tokenBurnPrice.currentPrice, 'wei')
              )}
            </Text>
          )}
        </WrapItem>
      </Wrap>
      <Chart />
      <Box>
        <Text fontWeight="500" fontSize={14} pl={2}>
          Price bonding curve
        </Text>
      </Box>
    </Card>
  )
}
