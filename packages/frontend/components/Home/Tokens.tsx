import React, { useEffect } from 'react'
import { Flex, Address, Wrap, WrapItem, Box, IconButton, ScaleFade } from '../ui'
import { TokenImage } from '../ui/TokenImage'
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

  if (fetching) return <Box align="center" >Loading...</Box>
  if (error) return <Box align="center" >Oh no... {error.message}</Box>

  if(tokens.length < 3){

    return (
      <Flex
        as="section"
        direction="column"
        align="center"
      >
        <Wrap spacing="30px" justify="center" align="center" m={8}>
          {tokens
            .map( (token) => (
              <WrapItem key={token.id}>
                <TokenCard size={250} token={token}/>
                <Address mt={2}>
                  {token.owner}
                </Address>
              </WrapItem>
            ))}
        </Wrap>
      </Flex>
    )

  }

  let tokensDisplayed = []

  if(index + 3 > tokens.length){
    tokensDisplayed = tokens
      .slice(index, tokens.length)
      .concat(tokens.slice(0, index + 3 - tokens.length) )
  } else {
    tokensDisplayed = tokens.slice(index, index + 3)
  }

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
    >
      <Flex justify="center" align="center" >
        <Box display={{base: 'none', 'lg': 'block' }} mr={8}>
          <ScaleFade initialScale={0} in={isOpen}>
            <TokenCard size={250} token={tokensDisplayed[0]}/>
          </ScaleFade>
        </Box>
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="grey"
          _hover={{}}
          onClick={() => {
            onToggle()
            setIndex(index === 0 ? tokens.length -1 : index - 1)
          }}
          _focus={{
            outline: "none"
          }}
          _active={{
            outline: "none"
          }}
        />
        <ScaleFade initialScale={0} in={isOpen} >
          <TokenCard size={350} token={tokensDisplayed[1]}/>
        </ScaleFade>
        <IconButton
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
        <Box display={{base: 'none', 'lg': 'block' }} ml={8}>
          <ScaleFade initialScale={0} in={isOpen} >
            <TokenCard size={250} token={tokensDisplayed[2]}/>
          </ScaleFade>
        </Box>
      </Flex>
      <Address mt={2}>
        {tokensDisplayed[1].owner}
      </Address>
    </Flex>
  )
}
