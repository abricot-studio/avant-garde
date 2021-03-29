import gql from 'graphql-tag'
import { Provider } from "@ethersproject/abstract-provider";
import { useEffect, useCallback, useState } from 'react'
import { useQuery } from 'urql'
import { getIpfsData } from '../lib/ipfs'
import { getContract } from '../lib/contracts'
import { useWeb3 } from '../contexts/Web3Context'

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
export const TokensQuery = gql`
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

async function fetchToken(provider: Provider, tokenId: string) {
  const contract = getContract(provider);
  const owner = await contract.ownerOf(tokenId)
    .catch(error => {
      if(error.message.includes('owner query for nonexistent token')) {
        return null;
      }
    });
  if(!owner) {
    return null;
  }
  const tokenUri = await contract.tokenURI(tokenId)

  const arbArtToken: ArbArtToken = {
    id: tokenId,
    owner,
    uri: tokenUri,
  };
  return arbArtToken;
}

export const useMyToken = () => {
  const { account } = useWeb3();
  const [fetching, setFetching] = useState<boolean>(true);
  const [myToken, setMyToken] = useState<ArbArtToken | null>(null);

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
        .then((arbArtToken: ArbArtToken | null) => {
          if(!arbArtToken) {
            setMyToken(null)
            setFetching(false)
            return;
          }
          provider.removeListener('block', poll);
          setMyToken(arbArtToken);
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

interface TokensQuery {
  first?: number,
  skip?: number,
}
export const defaultTokensQueryVariables = {
  first: 100,
  skip: 0,
};
export const useTokens = (query: TokensQuery = defaultTokensQueryVariables) => {
  const [result, reexecuteQuery] = useQuery({
    query: TokensQuery,
    variables: {
      first: query.first,
      skip: query.skip,
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
