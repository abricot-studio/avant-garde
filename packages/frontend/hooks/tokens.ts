import gql from 'graphql-tag'
import { Provider } from "@ethersproject/abstract-provider";
import { useEffect, useState } from 'react'
import { useQuery } from 'urql'
import { getIpfsData } from '../lib/ipfs'
import { getContractFromProvider } from '../lib/contracts'
import { useWeb3 } from '../contexts/Web3Context'
import { usePolling } from './graphql'

export interface AvantGardeToken {
  id: string;
  owner: string;
  tokenURI: string;
  mintTimestamp: string;
  mintPrice?: string;
  burnTimestamp?: string;
  burnPrice?: string;
}

export interface AvantGardeTokenMetadata {
  name: string;
  image: string;
  description: string;
  external_url: string;
}

export const TokenQuery = gql`
  query TokenQuery($address: ID!) {
    avantGardeToken(id: $address)  {
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
  query TokensQuery($first: Int, $skip: Int) {
    avantGardeTokens(first: $first, orderBy: mintTimestamp, orderDirection: desc, skip: $skip)  {
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
    avantGardeTokens(first: $first, skip: $skip, orderBy: mintTimestamp, orderDirection: desc, where: { owner: $address })  {
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

async function fetchToken(provider: Provider, tokenId: string) {
  const contract = await getContractFromProvider(provider);
  const owner = await contract.ownerOf(tokenId)
    .catch(error => {
      if(error.message.includes('owner query for nonexistent token')) {
        return null;
      }
      throw error;
    });
  if(!owner) {
    return null;
  }
  const tokenUri = await contract.tokenURI(tokenId)

  const avantGardeToken: AvantGardeToken = {
    id: tokenId,
    owner,
    tokenURI: tokenUri,
    mintTimestamp: '0'
  };
  return avantGardeToken;
}

export const useMyTokenOnChain = () => {
  const { account } = useWeb3();
  const [fetching, setFetching] = useState<boolean>(true);
  const [myToken, setMyToken] = useState<AvantGardeToken | null>(null);

  useEffect(() => {
    if(!account) {
      setMyToken(null)
      setFetching(false)
      return;
    }

    const { address, provider } = account;

    setFetching(true)
    const poll = () => {
      fetchToken(account.provider, address)
        .then((avantGardeToken: AvantGardeToken | null) => {
          if(!avantGardeToken) {
            setMyToken(null)
            setFetching(false)
            return;
          }
          provider.removeListener('block', poll);
          setMyToken(avantGardeToken);
          setFetching(false)
        })
        .catch(error => {
          setMyToken(null)
          setFetching(false)
          console.error(error);
        });
    }

    provider.on('block', poll);
    return () => {
      provider.removeListener('block', poll);
    }
  }, [account]);

  return {
    myToken,
    fetching,
  };
}

export interface TokensProps {
  first?: number,
  skip?: number,
}

export const defaultTokensQueryVariables:TokensProps = {
  first: 100,
  skip: 0,
};

export const useTokens = (tokensProps: TokensProps = defaultTokensQueryVariables) => {
  const [result, reexecuteQuery] = useQuery({
    query: TokensQuery,
    variables: {
      first: tokensProps.first,
      skip: tokensProps.skip
    }
  })
  const { data, fetching, error } = result

  const tokens: AvantGardeToken[] | null = data?.avantGardeTokens || null;

  return {
    tokens,
    fetching,
    error,
  }
}

export interface MyTokensProps {
  address: string
  first?: number,
  skip?: number,
}

export const defaultMyTokensQueryVariables:MyTokensProps = {
  address: null,
  first: 100,
  skip: 0,
};

export const useMyTokens = (tokensProps: MyTokensProps = defaultMyTokensQueryVariables) => {
  const [result, reexecuteQuery] = useQuery({
    query: MyTokensQuery,
    variables: {
      first: tokensProps.first,
      skip: tokensProps.skip,
      address: tokensProps.address
    },
    pause: !tokensProps.address,
  })
  const { data, fetching, error } = result

  const tokens: AvantGardeToken[] | null = tokensProps.address && data?.avantGardeTokens || [];

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
      address: address?.toLowerCase()
    },
    pause: !address,
  })
  const { data, fetching, error } = result

  const token: AvantGardeToken | null = address && data?.avantGardeToken || null;

  const { startPolling, stopPolling } = usePolling(reexecuteQuery)

  useEffect(() => {
    if(token) {
      stopPolling();
    }
  }, [token]);

  return {
    token,
    fetching,
    error,
    startPolling,
  }
}

const metadataCache = {};

export const useMetadata = (avantGardeToken: AvantGardeToken): AvantGardeTokenMetadata | null => {
  const [metadata, setMetadata] = useState<AvantGardeTokenMetadata | null>(null);

  useEffect(() => {
    if(metadataCache[avantGardeToken.tokenURI]) {
      setMetadata(metadataCache[avantGardeToken.tokenURI]);
      return;
    }

    setMetadata(null);
    getIpfsData(avantGardeToken.tokenURI)
      .then(metadata => {
        setMetadata(metadata);
        metadataCache[avantGardeToken.tokenURI] = metadata;
      })
      .catch(console.error)
  }, [avantGardeToken]);

  return metadata;
}
