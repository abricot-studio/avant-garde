import React from 'react'
import { Flex, Address, Wrap, WrapItem, Box, IconButton } from '../ui'
import { TokenImage } from '../ui/TokenImage'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

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

  if (fetching) return <Box align="center" >Loading...</Box>
  if (error) return <Box align="center" >Oh no... {error.message}</Box>
  const tokensDisplayed = tokens.slice(index, index + 3)

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
    >
      <Wrap spacing="30px" justify="center" align="center" m={8}>
        <WrapItem key={tokensDisplayed[0].id}>
          <TokenCard size={250} showAddress={false} token={tokensDisplayed[0]}/>
        </WrapItem>
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="grey"
          _hover={{}}
          onClick={() => setIndex(index +1 )}
          _focus={{
            outline: "none"
          }}
        />
        <WrapItem key={tokensDisplayed[1].id}>
          <TokenCard size={350} showAddress={true} token={tokensDisplayed[1]}/>
        </WrapItem>
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowRight} size="1x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="grey"
          _hover={{}}
          onClick={() => setIndex(index +1 )}
          _focus={{
            outline: "none"
          }}
        />
        <WrapItem key={tokensDisplayed[2].id}>
          <TokenCard size={250} showAddress={false} token={tokensDisplayed[2]}/>
        </WrapItem>
      </Wrap>
    </Flex>
  )
}
