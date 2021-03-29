import { initUrqlClient, withUrqlClient } from 'next-urql';
import { createClient, cacheExchange, Client, dedupExchange, fetchExchange, ssrExchange } from 'urql';

import config from '../config';

export const defaultClient = createClient({
  url: config.subgraphUrl,
})

export const getSsrClient = (): [Client, ReturnType<typeof ssrExchange>] => {
  const ssrCache = ssrExchange({ isClient: false });

  const ssrClient = initUrqlClient({
    url: config.subgraphUrl,
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
  }, false);

  if(!ssrClient) throw new Error('wtf');

  return [ssrClient, ssrCache];
}

export const wrapUrqlClient = (AppOrPage: React.FC<any>) =>
  withUrqlClient(
    (_ssrExchange) => ({
      url: config.subgraphUrl,
    }),
    {
      neverSuspend: true,
      ssr: false,
    },
  )
  (AppOrPage);
