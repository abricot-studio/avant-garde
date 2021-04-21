import gql from 'graphql-tag'
import { Provider } from "@ethersproject/abstract-provider";
import { useEffect, useCallback, useState, useMemo } from 'react'
import { useQuery } from 'urql'
import { getIpfsData } from '../lib/ipfs'
import { getContractFromProvider } from '../lib/contracts'
import { useWeb3 } from '../contexts/Web3Context'
import { usePolling } from './graphql'
import useSWR from 'swr'

export interface AvantGardeToken {
  id: string;
  owner: string;
  tokenURI: string;
  mintTimestamp: string;
  mintPrice?: string;
  burnTimestamp?: string;
  burnPrice?: string;
}

export interface AvantGardeTokenMintPrice {
  currentPrice: string;
  fees: string;
  total: string;
}

export interface AvantGardeTokenBurnPrice {
  currentPrice: string;
}

export interface AvantGardeTokenCountMint {
  current: string;
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

export async function fetchTokenPriceMint(provider: Provider) {
  const contract = await getContractFromProvider(provider);
  const tokenMintPrice = await contract.currentMintPrice()
  const avantGardeTokenMintPrice: AvantGardeTokenMintPrice = {
    currentPrice: tokenMintPrice[0].toString(),
    fees: tokenMintPrice[1].toString(),
    total: tokenMintPrice[0].add(tokenMintPrice[1]).toString()
  };
  return avantGardeTokenMintPrice;
}

export const useTokenPriceMint = () => {
  const { account } = useWeb3();
  const [fetching, setFetching] = useState<boolean>(true);
  const [tokenMintPrice, setTokenMintPrice] = useState<AvantGardeTokenMintPrice | null>(null);

  useEffect(() => {
    if(!account) {
      setTokenMintPrice(null)
      setFetching(false)
      return;
    }

    const { provider } = account;

    setFetching(true)
    const poll = () => {
      fetchTokenPriceMint(account.provider)
        .then((avantGardeTokenMintPrice: AvantGardeTokenMintPrice | null) => {
          if(!avantGardeTokenMintPrice) {
            setTokenMintPrice(null)
            setFetching(false)
            return;
          }
          provider.removeListener('block', poll);
          setTokenMintPrice(avantGardeTokenMintPrice);
          setFetching(false)
        })
        .catch(error => {
          setTokenMintPrice(null)
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
    tokenMintPrice,
    fetching,
  };
}

export async function fetchTokenPriceBurn(provider: Provider) {
  const contract = await getContractFromProvider(provider);
  const tokenBurnPrice = await contract.currentBurnPrice()
  const avantGardeTokenBurnPrice: AvantGardeTokenBurnPrice = {
    currentPrice: tokenBurnPrice.toString(),
  };
  return avantGardeTokenBurnPrice;
}

export const useTokenPriceBurn = () => {
  const { account } = useWeb3();
  const [fetching, setFetching] = useState<boolean>(true);
  const [tokenBurnPrice, setTokenBurnPrice] = useState<AvantGardeTokenBurnPrice | null>(null);

  useEffect(() => {
    if(!account) {
      setTokenBurnPrice(null)
      setFetching(false)
      return;
    }

    const { provider } = account;

    setFetching(true)
    const poll = () => {
      fetchTokenPriceBurn(account.provider)
        .then((avantGardeTokenBurnPrice: AvantGardeTokenBurnPrice | null) => {
          if(!avantGardeTokenBurnPrice) {
            setTokenBurnPrice(null)
            setFetching(false)
            return;
          }
          provider.removeListener('block', poll);
          setTokenBurnPrice(avantGardeTokenBurnPrice);
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

export async function fetchTokenCountMint(provider?: Provider) {
  const contract = await getContractFromProvider(provider);
  const tokenCountMint = await contract.countMint()
  const avantGardeTokenCountMint: AvantGardeTokenCountMint = {
    current: tokenCountMint.toString(),
  };

  return avantGardeTokenCountMint;
}

export const useTokenCountMint = () => {
  const { account } = useWeb3();
  const [fetching, setFetching] = useState<boolean>(true);
  const [tokenCountMint, setTokenCountMint] = useState<AvantGardeTokenCountMint | null>(null);

  useEffect(() => {

    setFetching(true)
    fetchTokenCountMint(account?.provider)
      .then((tokenCountMint: AvantGardeTokenCountMint | null) => {
        if(!tokenCountMint) {
          setTokenCountMint(null)
          setFetching(false)
          return;
        }
        setTokenCountMint(tokenCountMint);
        setFetching(false)
      })
      .catch(error => {
        setTokenCountMint(null)
        setFetching(false)
        console.error(error);
      });

  }, [account]);

  return {
    tokenCountMint,
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

  const tokens: AvantGardeToken[] | null = data?.avantGardeTokens || null;

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

  const tokens: AvantGardeToken[] | null = tokensProps.address && data?.avantGardeTokens || [];

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

  const token: AvantGardeToken | null = address && data?.avantGardeToken || null;

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

export const useMetadata = (avantGardeToken: AvantGardeToken, initialMetadata?): AvantGardeTokenMetadata | null => {
  const { data: metadata } = useSWR(
    avantGardeToken?.tokenURI,
    getIpfsData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      initialData: initialMetadata,
    }
  )

  return metadata
}

export const useCanMint = () => {
  const { account } = useWeb3();
  const { token, fetching } = useToken(account?.address)

  return useMemo<boolean>(() =>
    !account || !fetching && !token,
    [account, token, fetching]
  );
}
