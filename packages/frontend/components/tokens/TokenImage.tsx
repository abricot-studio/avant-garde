import React from 'react'
import { AvantGardeToken, useMetadata } from '../../hooks/tokens'
import { getIpfsUrl } from '../../lib/ipfs'
import { Box, Center, Image, Text, Flex } from '../ui'

export function TokenImage({
  avantGardeToken,
  size,
}: {
  avantGardeToken: AvantGardeToken
  size?: any
}) {
  const metadata = useMetadata(avantGardeToken)

  return <ImageFrame size={size} isBurned={Boolean(avantGardeToken.burnPrice)} src={metadata && getIpfsUrl(metadata.image)} />

}

const QuestionMark = () => (
  <Center boxSize="100%" position="absolute">
    <Text
      fontWeight={800}
      color="#f5f4f4"
      fontSize={{ base: '10rem', sm: '10rem', md: '15rem' }}
    >
      ?
    </Text>
  </Center>
)

export const smallSize = { base: 200, sm: 250 }
export const defaultSize = { base: 300, sm: 350 }

export function ImageFrame({
  src,
  size = defaultSize,
  isLoading,
  isQuestion,
  isBurned
}: {
  src?: string
  size?: any
  isLoading?: boolean
  isQuestion?: boolean
  isBurned?: boolean
}) {
  return (
    <Box
      borderRadius="full"
      backgroundColor="white"
      width={size}
      height={size}
      boxShadow="0px 10px 40px rgba(158, 158, 158, 0.15)"
    >
      <Box boxSize="90%" position="relative" top="5%" left="5%">
        <Box
          boxSize="100%"
          borderRadius="full"
          position="absolute"
          overflow="hidden"
        >
          {src && !isLoading && (
            <Image src={src} boxSize="100%" fallback={<QuestionMark />} opacity={isBurned ? 0.3 : 1}/>
          )}
          {!src && isLoading && (
            <Box bgColor="white" opacity={0.5} style={{ filter: 'blur(20px)' }}>
              <video width="100%" height="100%" autoPlay loop>
                <source src="../TEST-ANIM-AVANTGARDE.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
        </Box>
        <Box
          boxSize="100%"
          borderRadius="full"
          boxShadow="inset 0px 4px 20px rgba(129, 129, 129, 0.15)"
          position="absolute"
        />
        {
          isBurned && <Flex
            boxSize="100%"
            borderRadius="full"
            position="absolute"
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
            fontSize="3rem"
            boxShadow="inset 0px 10px 40px rgba(158, 158, 158, 0.15)"
          >
            🔥
          </Flex>
        }
        {isQuestion && <QuestionMark />}
      </Box>
    </Box>
  )
}
