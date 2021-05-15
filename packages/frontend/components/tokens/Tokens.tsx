import { useDisclosure } from '@chakra-ui/hooks'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
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

function TokenCard({ token, size }) {
  return (
    <Link href={`/token/${token.id}`} passHref>
      <a>
        <TokenImage avantGardeToken={token} size={size} />
      </a>
    </Link>
  )
}

export interface Props {
  tokens?: any[]
  fetching?: boolean
  error?: any
  mine?: boolean
}

export default function Tokens({ tokens, fetching, error, mine }: Props) {
  const [index, setIndex] = React.useState(0)
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  })
  const canMint = useCanMint()

  useEffect(() => {
    !isOpen && setTimeout(onToggle, 200)
  }, [isOpen])

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
              <TokenCard size={smallSize} token={tokensDisplayed[0]} />
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
            setIndex(index === 0 ? tokens.length - 1 : index - 1)
          }}
        />
        {tokensDisplayed[1] && (
          <ScaleFade in={isOpen}>
            <TokenCard size={defaultSize} token={tokensDisplayed[1]} />
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
            setIndex(index === tokens.length - 1 ? 0 : index + 1)
          }}
        />
        <Box
          display={{ base: 'none', lg: tokens.length > 1 ? 'block' : 'none' }}
          ml={8}
          mt={24}
        >
          <ScaleFade in={isOpen}>
            {tokensDisplayed[2] ? (
              <TokenCard size={smallSize} token={tokensDisplayed[2]} />
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
