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

export const TokenQuery = gql`
  query TokenQuery($address: ID!) {
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
  query TokensQuery($address: String, $first: Int, $skip: Int) {
    arbArtTokens(first: $first, skip: $skip, where: { owner: $address })  {
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
  const contract = await getContract(provider);
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

export interface TokensProps {
  address?: string
  first?: number,
  skip?: number,
}

export const defaultTokensQueryVariables:TokensProps = {
  address: null,
  first: 100,
  skip: 0,
};

export const useTokens = (tokensProps: TokensProps = defaultTokensQueryVariables) => {
  const [result, reexecuteQuery] = useQuery({
    query: TokensQuery,
    variables: {
      first: tokensProps.first,
      skip: tokensProps.skip,
      address: tokensProps.address
    }
  })
  const { data, fetching, error } = result

  const tokens: ArbArtToken[] | null = data?.arbArtTokens || null;

  const refresh = useCallback(() => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [reexecuteQuery]);

  // useEffect(() => {
  //   const timer = setInterval(() => refresh(), 5000);
  //   return () => clearInterval(timer);
  // }, [refresh]);

  return {
    tokens,
    fetching,
    error,
    refresh,
  }
}


export const useToken = (address: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: TokenQuery,
    variables: {
      address: address.toLowerCase()
    }
  })
  const { data, fetching, error } = result

  const token: ArbArtToken | null = data?.arbArtToken || null;

  const refresh = useCallback(() => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [reexecuteQuery]);

  useEffect(() => {
    const timer = setInterval(() => refresh, 5000);
    return () => clearInterval(timer);
  }, [refresh]);

  return {
    token,
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
