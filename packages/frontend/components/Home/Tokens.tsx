import React from 'react'
import { Flex, Address, Wrap, WrapItem, Heading } from '../ui'
import { useTokens } from '../../hooks/tokens'
import { TokenImage } from '../ui/TokenImage'
import Link from 'next/link'

function TokenCard({ token }) {
  return (
    <Link href={`/token/${token.id}`}>

      <Flex
        width="250px"
        height="260px"
        borderRadius={15}
        boxShadow="base"
        align="center"
        direction="column"
        p={4}
      >
        <TokenImage arbArtToken={token} />
        <Address mt={2}      >
          {token.owner}
        </Address>
      </Flex>
    </Link>

  );
}

export default function Tokens() {
  const { tokens, fetching, error } = useTokens()

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <Flex
      as="section"
      mb={12}
      direction="column"
      align="center"
    >
      <Heading>Existing tokens</Heading>
      <Wrap spacing="30px" justify="center" m={8}>
        {tokens
          .map((token) => (
            <WrapItem key={token.id}>
              <TokenCard token={token}/>
            </WrapItem>
          ))}
      </Wrap>
    </Flex>
  )
}
