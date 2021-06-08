export default {
  infuraId:
    process.env.NEXT_PUBLIC_INFURA_ID || '7dff5631849d491a8642b8a4efe05b01',
  defaultChainId: parseInt(process.env.DEFAULT_CHAIN_ID || '1'),
  ipfsEndpoint:
    process.env.NEXT_PUBLIC_IPFS_ENDPOINT ||
    'https://gateway.pinata.cloud/ipfs/',
  // 'https://cloudflare-ipfs.com/ipfs/',
  subgraphUrl:
    process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
    'https://api.thegraph.com/subgraphs/name/abricot-studio/avant-garde-rinkeby',
  // 'http://127.0.0.1:8000/subgraphs/name/abricot-studio/avant-garde-rinkeby',
  generateUrl:
    process.env.NEXT_PUBLIC_GENERATE_URL ||
    'https://api.avant-garde.gallery/api/generate',
  // 'http://localhost:3001/api/generate',
  registerUrl:
    process.env.NEXT_PUBLIC_REGISTER_URL ||
    'https://api.avant-garde.gallery/api/register',
  // 'http://localhost:3001/api/register',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' || false,
  whitelistMode: process.env.NEXT_PUBLIC_WHITELIST_MODE === 'true' || false,
  launchDate: '2021-07-15T20:00:00Z',
  startDate: '2021-06-03T20:00:00Z'
}
