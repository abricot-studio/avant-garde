import React, { useMemo, useEffect } from 'react'
import { Flex, Address, Box, IconButton, ScaleFade } from '../ui'
import { ImageFrame, TokenImage } from '../ui/TokenImage'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useDisclosure } from '@chakra-ui/hooks'

function TokenCard({ token, size }) {
  return (
    <Link href={`/token/${token.id}`}>
      <Flex
        align="center"
        direction="column"
        cursor="pointer"
      >
        <TokenImage
          arbArtToken={token}
          size={size}
        />
      </Flex>
    </Link>

  );
}

export interface Props {
  tokens?: any[];
  fetching?: boolean;
  error?: any;
}

export default function Tokens({ tokens, fetching, error }: Props) {

  const [index, setIndex] = React.useState(0)
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  })

  useEffect(() => {
    !isOpen && setTimeout(onToggle, 200)
  }, [isOpen])

  const tokensDisplayed = useMemo<any[]>(() => {
    if(!tokens){
      return []
    }
    if(tokens.length < 3){
      let t = []
      if(index === 0) {
        t.push(null)
      }
      t.push(...tokens)
      return t
    } else if(index + 3 > tokens.length){
      return tokens
        .slice(index, tokens.length)
        .concat(tokens.slice(0, index + 3 - tokens.length) )
    } else {
      return tokens.slice(index, index + 3)
    }
  }, [tokens, index])

  if (fetching) return <Box align="center" >Loading...</Box>
  if (error) return <Box align="center" >Oh no... {error.message}</Box>

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
    >
      <Flex justify="center" align="center" >
          <Box display={{base: 'none', 'lg': tokens.length > 1 ? 'block' : 'none' }} mr={8} >
            <ScaleFade initialScale={0} in={isOpen}>
              {
                tokensDisplayed[0] ?
                  <TokenCard size={250} token={tokensDisplayed[0]} />
                  :
                  <ImageFrame size={250} />
              }
            </ScaleFade>
          </Box>
        {
          tokensDisplayed[0] && <IconButton
            icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
            aria-label="Back"
            colorScheme="transparent"
            color="grey"
            _hover={{}}
            onClick={() => {
              onToggle()
              setIndex(index === 0 ? tokens.length - 1 : index - 1)
            }}
            _focus={{
              outline: "none"
            }}
            _active={{
              outline: "none"
            }}
          />
        }
        {
          tokensDisplayed[1] &&
          <ScaleFade initialScale={0} in={isOpen} >
            <TokenCard size={350} token={tokensDisplayed[1]}/>
          </ScaleFade>
        }
        {
          tokensDisplayed[2] && <IconButton
            icon={<FontAwesomeIcon icon={faArrowRight} size="1x" />}
            aria-label="Back"
            colorScheme="transparent"
            color="grey"
            _hover={{}}
            onClick={() => {
              onToggle()
              setIndex(index === tokens.length -1 ? 0 : index + 1)
            }}
            _focus={{
              outline: "none"
            }}
            _active={{
              outline: "none"
            }}
          />
        }
        <Box display={{ base: 'none', 'lg': tokens.length > 1 ? 'block' : 'none'  }} ml={8}>
            <ScaleFade initialScale={0} in={isOpen}>
              {
                tokensDisplayed[2] ?
                  <TokenCard size={250} token={tokensDisplayed[2]} />
                  :
                  <ImageFrame size={250} />
              }
            </ScaleFade>
          </Box>
      </Flex>
      {
        tokensDisplayed[1] &&
          <Address mt={2}>
            {tokensDisplayed[1].id}
          </Address>
      }
    </Flex>
  )
}
