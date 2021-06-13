import { useEthers } from '@usedapp/core'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { useMountedState } from 'react-use'
import { DiscordIcon, RedditIcon, TwitterIcon } from '../assets/icons'
import Counter from '../components/Counter'
import Layout from '../components/Layout'
import { defaultSize, ImageFrame } from '../components/tokens/TokenImage'
import {
  ActionButton,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SocialLink,
  Text,
} from '../components/ui'
import SEO from '../components/utils/SEO'
import { useRegister } from '../hooks/register'
import { URLs } from '../lib/constants'
import { wrapUrqlClient } from '../lib/graphql'
import { useWalletSelector } from '../lib/WalletSelector/context'

const seoData = {
  title: 'Register',
}

const Generator: React.FC = () => {
  const { isConnecting, open } = useWalletSelector()
  const { account } = useEthers()
  const { register, isRegistring, registrationResult } = useRegister()
  const isMounted = useMountedState()

  const socialPostUrls = useMemo(() => {
    if (!isMounted()) return {}
    const link = typeof window !== 'undefined' ? window.location.origin : ''

    const message = encodeURI(`I’m now registered on @avantgardenft 💘
    
Register and join the AvantGardists to discover your personalized AvantGarde NFT based on a deep-learning algorithm 🎨

${link}

`)

    const reddit = `https://reddit.com/submit?url=${link}&title=${message}`
    const twitter = `https://twitter.com/intent/tweet?text=${message}&hashtags=NFT,nftart,abstractart,art,NFTartist,generativeart,NFTCommunity,cryptoart`
    const discord = URLs.discord
    return {
      reddit,
      twitter,
      discord,
    }
  }, [registrationResult])

  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading textAlign="center" mb={8} fontFamily="Poppins, sans-serif">
          {registrationResult
            ? 'Thank you, see you again on the 15th of July'
            : 'Be part of the AvantGardist!'}
        </Heading>
        <Box as="section" my={8} position="relative">
          <Center h={defaultSize} position="absolute" opacity="0.8" w="100%">
            <ImageFrame />
            <Box h={defaultSize} w={defaultSize} position="absolute">
              {registrationResult && (
                <>
                  <Flex direction="column" mt={24} zIndex={1}>
                    <Text
                      fontSize="4rem"
                      textAlign="center"
                      sx={{
                        animation: ' breathing 3s ease-out infinite',
                        '@keyframes breathing': {
                          '0%': {
                            transform: 'scale(1)',
                          },
                          '50%': {
                            transform: 'scale(0.7)',
                          },
                          '100%': {
                            transform: 'scale(1)',
                          },
                        },
                      }}
                    >
                      💘
                    </Text>
                    <Text textAlign="center">Share it with other</Text>
                    <Text fontWeight={700} textAlign="center">
                      AvantGardist
                    </Text>
                  </Flex>
                  <SocialLink
                    icon={
                      <TwitterIcon
                        w={6}
                        h={6}
                        fill="#1FA1F1"
                        sx={{
                          animation: ' breathing 3s ease-out infinite',
                          '@keyframes breathing': {
                            '0%': {
                              transform: 'scale(1)',
                            },
                            '50%': {
                              transform: 'scale(0.7)',
                            },
                            '100%': {
                              transform: 'scale(1)',
                            },
                          },
                        }}
                      />
                    }
                    href={socialPostUrls.twitter}
                    label="twitter"
                    position="absolute"
                    left="10%"
                    top="80%"
                    sx={{
                      animation: 'x-motion-l-down 1s ease-out forwards',
                      '@keyframes x-motion-l-down': {
                        '0%': {
                          top: '60%',
                          left: '0%',
                        },
                        '100%': {
                          top: '80%',
                          left: '10%',
                        },
                      },
                    }}
                  />
                  <SocialLink
                    icon={
                      <DiscordIcon
                        w={6}
                        h={6}
                        sx={{
                          animation: ' breathing 3s ease-out infinite',
                          '@keyframes breathing': {
                            '0%': {
                              transform: 'scale(1)',
                            },
                            '50%': {
                              transform: 'scale(0.7)',
                            },
                            '100%': {
                              transform: 'scale(1)',
                            },
                          },
                        }}
                      />
                    }
                    href={socialPostUrls.discord}
                    label="twitter"
                    position="absolute"
                    left="45%"
                    top="91%"
                  />
                  <SocialLink
                    icon={
                      <RedditIcon
                        w={6}
                        h={6}
                        fill="#FF4500"
                        sx={{
                          animation: ' breathing 3s ease-out infinite',
                          '@keyframes breathing': {
                            '0%': {
                              transform: 'scale(1)',
                            },
                            '50%': {
                              transform: 'scale(0.7)',
                            },
                            '100%': {
                              transform: 'scale(1)',
                            },
                          },
                        }}
                      />
                    }
                    href={socialPostUrls.reddit}
                    label="reddit"
                    position="absolute"
                    right="10%"
                    top="80%"
                    sx={{
                      animation: 'x-motion-r-down 1s ease-out forwards',
                      '@keyframes x-motion-r-down': {
                        '0%': {
                          top: '60%',
                          right: '0%',
                        },
                        '100%': {
                          top: '80%',
                          right: '10%',
                        },
                      },
                    }}
                  />
                </>
              )}
            </Box>
          </Center>

          <Center h={defaultSize} flexDirection="column" mx={8}>
            {!registrationResult && <Counter />}
          </Center>
        </Box>
        <Box align="center" mt={8}>
          {!registrationResult && account && (
            <ActionButton
              onClick={register}
              isLoading={isRegistring}
              loadingText="Registring..."
            >
              Register
            </ActionButton>
          )}
          {!registrationResult && !account && (
            <ActionButton
              onClick={open}
              isLoading={isConnecting}
              loadingText="Connecting wallet..."
            >
              Connect wallet
            </ActionButton>
          )}
          {registrationResult && (
            <Link passHref href="/about">
              <Button
                as="a"
                variant="outline"
                borderRadius="full"
                border="2px"
                borderColor="pupu"
                bgColor="white"
                px={12}
                rounded="full"
                _hover={{}}
                w="12rem"
              >
                Learn more
              </Button>
            </Link>
          )}
        </Box>
        <Text textAlign="center" mt={4} mb={6} px={4} fontWeight={500}>
          Only registered people will be able to mint their AvantGarde artwork
          {/*We will be able to generate your unique artwork from the 15th of July 2021*/}
        </Text>
      </Layout>
    </>
  )
}

export default wrapUrqlClient(Generator)