import React from 'react'
import { Flex, Address, Wrap, WrapItem, Box } from '../ui'
import { TokenImage } from '../ui/TokenImage'
import Link from 'next/link'

export function TokenCard({ token }) {
  return (
    <Link href={`/token/${token.id}`}>
      <Flex
        align="center"
        direction="column"
        cursor="pointer"
      >
        <TokenImage
          arbArtToken={token}
        />
        <Address mt={2}>
          {token.owner}
        </Address>
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

  if (fetching) return <Box align="center" >Loading...</Box>
  if (error) return <Box align="center" >Oh no... {error.message}</Box>

  return (
    <Flex
      as="section"
      mb={12}
      direction="column"
      align="center"
    >
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
