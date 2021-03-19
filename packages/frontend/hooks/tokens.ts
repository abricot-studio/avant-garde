import gql from 'graphql-tag'
import { useEffect, useCallback, useState } from 'react'
import { useQuery } from 'urql'
import { getIpfsData } from '../lib/ipfs'

export interface ArbArtToken {
  id: string;
  owner: string;
  uri: string;
}
export interface ArbArtTokenMetadata {
  name: string;
  image: string;
  description: string;
  external_url: string;
}

const MyTokenQuery = gql`
  query MyTokenQuery($address: ID!) {
    arbArtToken(id: $address)  {
      id
      owner
      uri
      #metadata {
      #  name
      #  description
      #  external_url
      #  image
      #}
    }
  }
`
const TokensQuery = gql`
  query TokensQuery($first: Int, $skip: Int) {
    arbArtTokens(first: $first, skip: $skip)  {
      id
      owner
      uri
      #metadata {
      #  name
      #  description
      #  external_url
      #  image
      #}
    }
  }
`

export const useMyToken = (address?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: MyTokenQuery,
    variables: {
      address: address?.toLowerCase(),
    },
    pause: !address,
  })
  const { data, fetching, error } = result

  const myToken: ArbArtToken | null = data?.arbArtToken || null;

  const refresh = useCallback(() => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [reexecuteQuery]);

  return {
    myToken,
    fetching,
    error,
    refresh,
  }
}

interface TokensQuery {
  first?: number,
  skip?: number,
}
export const useTokens = (query: TokensQuery = {}) => {
  const [result] = useQuery({
    query: TokensQuery,
    variables: {
      first: query.first || 100,
      skip: query.skip || 0,
    }
  })
  const { data, fetching, error } = result

  const tokens: ArbArtToken[] | null = data?.arbArtTokens || null;

  return {
    tokens,
    fetching,
    error,
  }
}

export const useMetadata = (arbArtToken: ArbArtToken): ArbArtTokenMetadata | null => {
  const [metadata, setMetadata] = useState<ArbArtTokenMetadata | null>(null);

  useEffect(() => {
    getIpfsData(arbArtToken.uri)
      .then(setMetadata)
      .catch(console.error)
  }, [arbArtToken]);

  return metadata;
}
