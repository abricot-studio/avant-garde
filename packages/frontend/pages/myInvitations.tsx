import { useClipboard } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { useMountedState } from 'react-use'
import { DiscordIcon, RedditIcon, TwitterIcon } from '../assets/icons'
import Layout from '../components/Layout'
import {
  ActionButton,
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Heading,
  SocialLink,
  Text,
} from '../components/ui'
import SEO from '../components/utils/SEO'
import config from '../config'
import { useAuth } from '../hooks/authContext'
import { useToken } from '../hooks/tokens'
import { URLs } from '../lib/constants'
import { wrapUrqlClient } from '../lib/graphql'
import { encode } from '../lib/inviteCode'
import { useWalletSelector } from '../lib/WalletSelector/context'

const seoData = {
  title: 'My Invitations',
}
const origin = typeof window !== 'undefined' ? window.location.origin : ''

const Invitation = ({ invite, index }) => {
  const encoded = encode(invite.code)
  const copyLink = useClipboard(`${origin}/generator?inviteCode=${encoded}`)
  const copyCode = useClipboard(encoded)

  return (
    <Flex key={invite.code} direction="column" position="relative">
      <Text mt={8} fontWeight={700}
      opacity={invite.used ? 0.5: 1}
      >
        Invitation {index + 1}
      </Text>
      <Box
        boxShadow="inset 0px 4px 20px rgba(129, 129, 129, 0.15)"
        borderRadius="md"
        px={4}
        my={2}
        opacity={invite.used ? 0.5: 1}
      >
        <Text fontSize="0.8rem" my={2}>
          {encoded}
        </Text>
      </Box>
      <Flex justifyContent="center" mt={4}>
        <ActionButton size="sm" w="7rem" mr={4} onClick={copyLink.onCopy} disabled={invite.used}>
          {copyLink.hasCopied ? 'Copied ✔️' : 'Copy link'}
        </ActionButton>
        <ActionButton size="sm" w="7rem" onClick={copyCode.onCopy} disabled={invite.used}>
          {copyCode.hasCopied ? 'Copied ✔️' : 'Copy code'}
        </ActionButton>
      </Flex>
      {
        invite.used && (<Flex
        position="absolute"
        fontSize="5rem"
        top="20%"
        justifyContent="center"
        w="100%"
        >🔥</Flex>)
      }
    </Flex>
  )
}

const MyInvitationsPage: React.FC = () => {
  const { isConnecting } = useWalletSelector()
  const { account } = useEthers()
  const router = useRouter()
  const { token } = useToken(account)
  const { invites } = useAuth()
  const isMounted = useMountedState()

  const socialPostUrls = useMemo(() => {
    if (!isMounted()) return {}
    const link = typeof window !== 'undefined' ? window.location.origin : ''
    const tags =
      '#NFTs #nftart #abstractart #art #NFTartist #generativeart #NFTCommunity #cryptoart'

    const messageTwitter = `I have ${invites.filter(invite => !invite.used).length} invites to access the #NFT Generator! 💘
Join the AvantGardists to discover your personalized AvantGarde #NFT, 🔥
generated by a deep-learning algorithm 🎨

${link}

${tags}`
    const messageReddit = `I have ${invites.filter(invite => !invite.used).length} invites to access the NFT Generator! 💘
Join the AvantGardists to discover your personalized AvantGarde NFT, 🔥
generated by a deep-learning algorithm 🎨`
    const reddit = `https://reddit.com/submit?url=${link}&title=${messageReddit}`
    const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      messageTwitter
    )}`
    const discord = URLs.discord
    return {
      reddit,
      twitter,
      discord,
    }
  }, [invites])

  useEffect(() => {
    if ((!isConnecting && !account) || config.whitelistMode) {
      router.push(`/`)
    }
  }, [isConnecting, account])

  if (!account || config.whitelistMode) {
    return <div></div>
  }

  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading
          textAlign="center"
          mb={8}
          fontFamily="Poppins, sans-serif"
          as="h1"
        >
          My invitations
          <Badge
            bg="radial-gradient(99.98% 99.98% at 50.02% 99.98%, #FFAB07 0%, #FF3507 100%)"
            color="white"
            rounded="full"
            w="1rem"
            h="1rem"
            fontSize="0.7rem"
            lineHeight="1rem"
            verticalAlign="text-top"
            mr={2}
            borderRadius="full"
            textAlign="center"
            alignSelf="center"
          >
            {invites.length === 0 ? '' : invites.filter(invite => !invite.used).length}
          </Badge>
        </Heading>
        <Container w="90%" maxW="container.sm">
          <Card p={8} mb={4}>
            {invites.length > 0 ? (
              <Flex direction="column">
                <Heading
                  fontSize="1.2rem"
                  align="center"
                  fontFamily="Poppins, sans-serif"
                >
                  You have {invites.filter(invite => !invite.used).length} Invitations
                </Heading>
                <Text my={4} fontSize="0.8rem" textAlign="center">
                  The person you invite will have access to the generator and
                  will be able to mint it’s AvantGarde NFT
                </Text>
                <Flex direction="column" alignItems="center">
                  {invites.map((invite, i) => (
                    <Invitation invite={invite} index={i} key={invite.code} />
                  ))}
                </Flex>
              </Flex>
            ) : (
              <Flex as="section" direction="column" align="center">
                You do not own any invitations yet.
              </Flex>
            )}
          </Card>
          <Flex justifyContent="center" direction="column">
            {invites.length > 0 && (
              <Flex justifyContent="space-around">
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
                />
              </Flex>
            )}
            {token ? (
              <Flex justifyContent="center" mt={4}>
                <Link passHref href="/gallery">
                  <ActionButton as="a" w="12rem">
                    Gallery
                  </ActionButton>
                </Link>
              </Flex>
            ) : (
              <Flex justifyContent="center">
                <Link passHref href="/generator">
                  <ActionButton as="a" w="12rem">
                    Generate yours
                  </ActionButton>
                </Link>{' '}
              </Flex>
            )}
          </Flex>
        </Container>
      </Layout>
    </>
  )
}

export default wrapUrqlClient(MyInvitationsPage)
