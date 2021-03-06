import { useDisclosure } from '@chakra-ui/hooks'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addressEqual, useEthers } from '@usedapp/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { useCanMint } from '../../hooks/mint'
import {
  ActionButton,
  Address,
  Box,
  Center,
  Flex,
  IconButton,
  ScaleFade,
  Spinner,
} from '../ui'
import { defaultSize, ImageFrame, smallSize, TokenImage } from './TokenImage'

function TokenCard({ token, size, isMine = false }) {
  return (
    <Link href={`/token/${token.id}`} passHref>
      <a>
        <TokenImage avantGardeToken={token} size={size} />
        {isMine && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="1x"
            color="#BC6BFB"
            style={{ float: 'right' }}
          />
        )}
      </a>
    </Link>
  )
}

export interface Props {
  tokens?: any[]
  fetching?: boolean
  error?: any
  mine?: boolean
  skip?: number
}

export default function Tokens({
  tokens,
  fetching,
  error,
  mine,
  skip = 0,
}: Props) {
  const router = useRouter()
  const { account } = useEthers()
  const [index, setIndex] = React.useState(skip)
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  })
  const canMint = useCanMint()

  useEffect(() => {
    !isOpen && setTimeout(onToggle, 200)
  }, [isOpen, onToggle])

  const tokensDisplayed = useMemo<any[]>(() => {
    if (!tokens || tokens.length === 0) {
      return []
    }
    if (tokens.length < 3) {
      let t = []
      if (index === 0) {
        t.push(null)
      }
      t.push(...tokens)
      return t
    } else if (index + 3 > tokens.length) {
      return tokens
        .slice(index, tokens.length)
        .concat(tokens.slice(0, index + 3 - tokens.length))
    } else {
      return tokens.slice(index, index + 3)
    }
  }, [tokens, index])

  if (fetching)
    return (
      <Box align="center">
        <Spinner size="lg" />
      </Box>
    )
  if (error) return <Box align="center">Oh no... {error.message}</Box>

  if (tokensDisplayed.length === 0) {
    return (
      <Flex as="section" direction="column" align="center">
        {mine
          ? 'You do not own any token yet.'
          : 'No token have been minted yet.'}
      </Flex>
    )
  }

  return (
    <Flex as="section" direction="column" align="center">
      <Flex justify="center" align="center">
        <Box
          display={{ base: 'none', lg: tokens.length > 1 ? 'block' : 'none' }}
          mr={8}
          mt={24}
        >
          <ScaleFade in={isOpen}>
            {tokensDisplayed[0] ? (
              <TokenCard
                size={smallSize}
                token={tokensDisplayed[0]}
                isMine={account && addressEqual(account, tokensDisplayed[0].id)}
              />
            ) : (
              <ImageFrame size={smallSize} />
            )}
          </ScaleFade>
        </Box>
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
          aria-label="Previous token"
          color="grey"
          variant="link"
          isDisabled={!tokensDisplayed[0]}
          onClick={() => {
            onToggle()
            const i = index === 0 ? tokens.length - 1 : index - 1
            setIndex(i)
            if (router.route.startsWith('/gallery')) {
              router.replace(`/gallery/${i}`, undefined, { shallow: true })
            }
          }}
        />
        {tokensDisplayed[1] && (
          <ScaleFade in={isOpen}>
            <TokenCard
              size={defaultSize}
              token={tokensDisplayed[1]}
              isMine={account && addressEqual(account, tokensDisplayed[1].id)}
            />
          </ScaleFade>
        )}
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowRight} size="1x" />}
          aria-label="Next token"
          variant="link"
          color="grey"
          isDisabled={!tokensDisplayed[2]}
          onClick={() => {
            onToggle()
            const i = index === tokens.length - 1 ? 0 : index + 1
            setIndex(i)
            if (router.route.startsWith('/gallery')) {
              router.replace(`/gallery/${i}`, undefined, { shallow: true })
            }
          }}
        />
        <Box
          display={{ base: 'none', lg: tokens.length > 1 ? 'block' : 'none' }}
          ml={8}
          mt={24}
        >
          <ScaleFade in={isOpen}>
            {tokensDisplayed[2] ? (
              <TokenCard
                size={smallSize}
                token={tokensDisplayed[2]}
                isMine={account && addressEqual(account, tokensDisplayed[2].id)}
              />
            ) : (
              <ImageFrame size={smallSize} />
            )}
          </ScaleFade>
        </Box>
      </Flex>
      {tokensDisplayed[1] && (
        <Address
          mt={8}
          fontWeight={700}
          fontSize={{ base: '0.8rem', sm: '1rem', md: '1rem' }}
          fontFamily='"Roboto Mono", sans-serif'
        >
          {tokensDisplayed[1].id}
        </Address>
      )}
      {canMint && (
        <Center mt={8}>
          <Link passHref href="/generator">
            <ActionButton as="a">Generate yours</ActionButton>
          </Link>
        </Center>
      )}
    </Flex>
  )
}
