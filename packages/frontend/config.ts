export default {
  infuraId:
    process.env.NEXT_PUBLIC_INFURA_ID || '7dff5631849d491a8642b8a4efe05b01',
  defaultChainId: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || '1'),
  ipfsEndpoint:
    process.env.NEXT_PUBLIC_IPFS_ENDPOINT ||
    'https://gateway.pinata.cloud/ipfs/',
  // 'https://cloudflare-ipfs.com/ipfs/',
  subgraphUrl:
    process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
    'https://api.thegraph.com/subgraphs/name/abricot-studio/avant-garde-rinkeby',
  // 'http://127.0.0.1:8000/subgraphs/name/abricot-studio/avant-garde-rinkeby',
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL || 'https://api.avant-garde.gallery',
  // 'http://localhost:3001',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' || false,
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
  analyticsDomain:
    process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN ||
    'https://something.avant-garde.gallery',
  whitelistMode: process.env.NEXT_PUBLIC_WHITELIST_MODE === 'true' || false,
  launchDate: '2021-07-15T22:00:00Z',
  startDate: '2021-06-03T20:00:00Z',
  authMessage:
    process.env.NEXT_PUBLIC_AUTH_MESSAGE ||
    '\x19Ethereum Signed Message:\nTo log in and be part of the other AvantGardists, please sign this message',
}
