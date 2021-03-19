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

  const myToken: ArbArtToken | null = address && data?.arbArtToken || null;

  const refresh = useCallback(() => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [reexecuteQuery]);

  useEffect(() => {
    if(myToken || !address) return;

    const timer = setInterval(() => refresh, 5000);
    return () => clearInterval(timer);
  }, [refresh, myToken])

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
  const [result, reexecuteQuery] = useQuery({
    query: TokensQuery,
    variables: {
      first: query.first || 100,
      skip: query.skip || 0,
    }
  })
  const { data, fetching, error } = result

  const tokens: ArbArtToken[] | null = data?.arbArtTokens || null;

  const refresh = useCallback(() => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [reexecuteQuery]);

  useEffect(() => {
    const timer = setInterval(() => refresh, 5000);
    return () => clearInterval(timer);
  }, [refresh]);

  return {
    tokens,
    fetching,
    error,
    refresh,
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
