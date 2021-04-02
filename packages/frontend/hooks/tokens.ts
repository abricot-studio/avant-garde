import gql from 'graphql-tag'
import { Provider } from "@ethersproject/abstract-provider";
import { useEffect, useCallback, useState } from 'react'
import { useQuery } from 'urql'
import { getIpfsData } from '../lib/ipfs'
import { getContract } from '../lib/contracts'
import { useWeb3 } from '../contexts/Web3Context'
import { usePolling } from './graphql'

export interface ArbArtToken {
  id: string;
  owner: string;
  tokenURI: string;
  mintTimestamp: string;
  mintPrice?: string;
  burnTimestamp?: string;
  burnPrice?: string;
}

export interface ArbArtTokenMintPrice {
  currentPrice: string;
  fees: string;
  total: string;
}

export interface ArbArtTokenBurnPrice {
  currentPrice: string;
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
    arbArtTokens(first: $first, orderBy: mintTimestamp, orderDirection: desc, skip: $skip)  {
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
    arbArtTokens(first: $first, skip: $skip, orderBy: mintTimestamp, orderDirection: desc, where: { owner: $address })  {
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
    tokenURI: tokenUri,
    blockTimestamp: 0
  };
  return arbArtToken;
}

export const useMyTokenOnChain = () => {
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

export async function fetchTokenPriceMint(provider: Provider) {
  const contract = await getContract(provider);
  const tokenMintPrice = await contract.currentMintPrice()
  const arbArtTokenMintPrice: ArbArtTokenMintPrice = {
    currentPrice: tokenMintPrice[0].toString(),
    fees: tokenMintPrice[1].toString(),
    total: tokenMintPrice[0].add(tokenMintPrice[1]).toString()
  };
  return arbArtTokenMintPrice;
}

export const useTokenMintPrice = () => {
  const { account } = useWeb3();
  const [fetchingMint, setFetchingMint] = useState<boolean>(true);
  const [tokenMintPrice, setTokenMintPrice] = useState<ArbArtTokenMintPrice | null>(null);

  useEffect(() => {
    if(!account) {
      setTokenMintPrice(null)
      setFetchingMint(false)
      return;
    }

    const { provider } = account;

    setFetchingMint(true)
    const poll = () => {
      fetchTokenPriceMint(account.provider)
        .then((arbArtTokenMintPrice: ArbArtTokenMintPrice | null) => {
          if(!arbArtTokenMintPrice) {
            setTokenMintPrice(null)
            setFetchingMint(false)
            return;
          }
          provider.removeListener('block', poll);
          setTokenMintPrice(arbArtTokenMintPrice);
          setFetchingMint(false)
        })
        .catch(error => {
          setTokenMintPrice(null)
          setFetchingMint(false)
          console.error(error);
        });
    }

    provider.on('block', poll);
    return () => {
      provider.removeListener('block', poll);
    }
  }, [account]);

  return {
    tokenMintPrice,
    fetchingMint,
  };
}

async function fetchTokenBurnMint(provider: Provider) {
  const contract = await getContract(provider);
  const tokenBurnPrice = await contract.currentPrice()
  const arbArtTokenBurnPrice: ArbArtTokenBurnPrice = {
    currentPrice: tokenBurnPrice.currentPrice.toString(),
  };
  return arbArtTokenBurnPrice;
}

export const useTokenBurnPrice = () => {
  const { account } = useWeb3();
  const [fetching, setFetching] = useState<boolean>(true);
  const [tokenBurnPrice, setTokenBurnPrice] = useState<ArbArtTokenBurnPrice | null>(null);

  useEffect(() => {
    if(!account) {
      setTokenBurnPrice(null)
      setFetching(false)
      return;
    }

    const { provider } = account;

    setFetching(true)
    const poll = () => {
      fetchTokenBurnMint(account.provider)
        .then((arbArtTokenBurnPrice: ArbArtTokenBurnPrice | null) => {
          if(!arbArtTokenBurnPrice) {
            setTokenBurnPrice(null)
            setFetching(false)
            return;
          }
          provider.removeListener('block', poll);
          setTokenBurnPrice(arbArtTokenBurnPrice);
          setFetching(false)
        })
        .catch(error => {
          setTokenBurnPrice(null)
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
    tokenBurnPrice,
    fetching,
  }
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

  const tokens: ArbArtToken[] | null = tokensProps.address && data?.arbArtTokens || [];

  const refresh = useCallback(() => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [reexecuteQuery]);

  return {
    tokens,
    fetching,
    error,
    refresh,
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

  const token: ArbArtToken | null = address && data?.arbArtToken || null;

  const { refresh, startPolling, stopPolling } = usePolling(reexecuteQuery)

  useEffect(() => {
    if(token) {
      stopPolling();
    }
  }, [token]);

  return {
    token,
    fetching,
    error,
    refresh,
    startPolling,
  }
}

export const useMetadata = (arbArtToken: ArbArtToken): ArbArtTokenMetadata | null => {
  const [metadata, setMetadata] = useState<ArbArtTokenMetadata | null>(null);

  useEffect(() => {
    getIpfsData(arbArtToken.tokenURI)
      .then(setMetadata)
      .catch(console.error)
  }, [arbArtToken]);

  return metadata;
}
