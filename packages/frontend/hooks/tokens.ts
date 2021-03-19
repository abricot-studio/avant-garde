import gql from 'graphql-tag'
import { useCallback } from 'react'
import { useQuery } from 'urql'

const MyTokenQuery = gql`
query MyTokenQuery($address: ID!) {
  arbArtToken(id: $address)  {
    id
    owner
    uri
    metadata {
      name
      description
      external_url
      image
    }
  }
}
`
const TokensQuery = gql`
query TokensQuery($first: Int, $skip: Int) {
  arbArtTokens(first: $first, skip: $skip)  {
    id
    owner
    uri
    metadata {
      name
      description
      external_url
      image
    }
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

  const myToken = data?.arbArtToken

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

  const tokens = data?.arbArtTokens

  return {
    tokens,
    fetching,
    error,
  }
}
