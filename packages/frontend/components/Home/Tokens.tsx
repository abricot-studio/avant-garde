import React, { useEffect } from 'react'
import { Flex, Address, Wrap, WrapItem, Box, IconButton, ScaleFade } from '../ui'
import { TokenImage } from '../ui/TokenImage'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useDisclosure } from '@chakra-ui/hooks'

export function TokenCard({ token, size, showAddress }) {
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
        {
          showAddress ?
            <Address mt={2}>
              {token.owner}
            </Address> : ''
        }
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

  let tokensDisplayed

  if(index + 3 > tokens.length){
    tokensDisplayed = tokens
      .slice(index, tokens.length)
      .concat(tokens.slice(0, index + 3 - tokens.length) )
  } else {
    tokensDisplayed = tokens.slice(index, index + 3)
  }

  if(tokensDisplayed.length !== 3){

    return (
      <Flex
        as="section"
        direction="column"
        align="center"
      >
        <Wrap spacing="30px" justify="center" align="center" m={8}>
          {tokensDisplayed
            .map( (token) => (
              <WrapItem key={token.id}>
                <TokenCard size={250} showAddress={true} token={token}/>
              </WrapItem>
            ))}
        </Wrap>
      </Flex>
    )

  }

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
    >
      <Wrap spacing="30px" justify="center" align="center" m={8}>
          <WrapItem key={tokensDisplayed[0].id}>
            <ScaleFade initialScale={0} in={isOpen}>
              <TokenCard size={250} showAddress={false} token={tokensDisplayed[0]}/>
            </ScaleFade>
          </WrapItem>
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="grey"
          _hover={{}}
          onClick={() => setIndex(index === 0 ? tokens.length -1 : index - 1)}
          _focus={{
            outline: "none"
          }}
        />
        <WrapItem key={tokensDisplayed[1].id}>
          <ScaleFade initialScale={0} in={isOpen} >
            <TokenCard size={350} showAddress={true} token={tokensDisplayed[1]}/>
          </ScaleFade>
        </WrapItem>
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
        />
        <WrapItem key={tokensDisplayed[2].id}>
          <ScaleFade initialScale={0} in={isOpen} >
            <TokenCard size={250} showAddress={false} token={tokensDisplayed[2]}/>
          </ScaleFade>
        </WrapItem>
      </Wrap>
    </Flex>
  )
}
