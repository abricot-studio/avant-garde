import gql from 'graphql-tag'
import { useEffect } from 'react'
import useSWR from 'swr'
import { useQuery } from 'urql'
import { getIpfsData } from '../lib/ipfs'
import { usePolling } from './graphql'

export interface AvantGardeToken {
  id: string
  owner: string
  tokenURI: string
  mintTimestamp: string
  mintPrice?: string
  burnTimestamp?: string
  burnPrice?: string
}

export interface AvantGardeTokenMetadata {
  name: string
  image: string
  description: string
  external_url: string
}

export const TokenQuery = gql`
  query TokenQuery($address: ID!) {
    avantGardeToken(id: $address) {
      id
      owner
      tokenURI
      mintTimestamp
      mintPrice
      burnTimestamp
      burnPrice
      #metadata {
      #  name
      #  description
      #  external_url
      #  image
      #}
    }
  }
`
export const TokensQuery = gql`
  query TokensQuery($first: Int, $skip: Int, $orderBy: Int, $orderDirection: String) {
    avantGardeTokens(
      first: $first
      skip: $skip
      orderBy: mintTimestamp
      orderDirection: desc
    ) {
      id
      owner
      tokenURI
      mintTimestamp
      mintPrice
      burnTimestamp
      burnPrice
      #metadata {
      #  name
      #  description
      #  external_url
      #  image
      #}
    }
  }
`
export const MyTokensQuery = gql`
  query MyTokensQuery($address: String!, $first: Int, $skip: Int) {
    avantGardeTokens(
      first: $first
      skip: $skip
      orderBy: mintTimestamp
      orderDirection: desc
      where: { owner: $address }
    ) {
      id
      owner
      tokenURI
      mintTimestamp
      mintPrice
      burnTimestamp
      burnPrice
      #metadata {
      #  name
      #  description
      #  external_url
      #  image
      #}
    }
  }
`

export interface TokensProps {
  first?: number
  skip?: number
}

export const defaultTokensQueryVariables: TokensProps = {
  first: 100,
  skip: 0,
}

export const useTokens = (
  tokensProps: TokensProps = defaultTokensQueryVariables
) => {
  const [result] = useQuery({
    query: TokensQuery,
    variables: {
      first: tokensProps.first,
      skip: tokensProps.skip,
    },
  })
  const { data, fetching, error } = result

  const tokens: AvantGardeToken[] | null = data?.avantGardeTokens || null

  return {
    tokens,
    fetching,
    error,
  }
}

export interface MyTokensProps {
  address: string
  first?: number
  skip?: number
}

export const defaultMyTokensQueryVariables: MyTokensProps = {
  address: null,
  first: 100,
  skip: 0,
}

export const useMyTokens = (
  tokensProps: MyTokensProps = defaultMyTokensQueryVariables
) => {
  const [result] = useQuery({
    query: MyTokensQuery,
    variables: {
      first: tokensProps.first,
      skip: tokensProps.skip,
      address: tokensProps.address,
    },
    pause: !tokensProps.address,
  })
  const { data, fetching, error } = result

  const tokens: AvantGardeToken[] | null =
    (tokensProps.address && data?.avantGardeTokens) || []

  return {
    tokens,
    fetching,
    error,
  }
}

export const useToken = (address?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: TokenQuery,
    variables: {
      address: address?.toLowerCase(),
    },
    pause: !address,
  })
  const { data, fetching, error } = result

  const token: AvantGardeToken | null =
    (address && data?.avantGardeToken) || null

  const pollingMint = usePolling(reexecuteQuery)
  const pollingBurn = usePolling(reexecuteQuery)

  useEffect(() => {
    if (token) {
      pollingMint.stopPolling()
      if (Boolean(token.burnPrice)) {
        pollingBurn.stopPolling()
      }
    }
  }, [token])

  return {
    token,
    fetching,
    error,
    startPollingMint: pollingMint.startPolling,
    startPollingBurn: pollingBurn.startPolling,
  }
}

export const useMetadata = (
  avantGardeToken: AvantGardeToken,
  initialMetadata?
): AvantGardeTokenMetadata | null => {
  const { data: metadata } = useSWR(avantGardeToken?.tokenURI, getIpfsData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    initialData: initialMetadata,
  })

  return metadata
}
