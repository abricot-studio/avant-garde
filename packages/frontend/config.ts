export default {
  infuraId:
    process.env.NEXT_PUBLIC_INFURA_ID || '781d8466252d47508e177b8637b1c2fd',
  ipfsEndpoint:
    process.env.NEXT_PUBLIC_IPFS_ENDPOINT ||
    'https://gateway.pinata.cloud/ipfs/',
    // 'https://cloudflare-ipfs.com/ipfs/',
  subgraphUrl:
    process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
    'https://api.thegraph.com/subgraphs/name/julesgoullee/arbart',
    // 'http://127.0.0.1:8000/subgraphs/name/pakokrew/arbart',
  generateUrl:
    process.env.NEXT_PUBLIC_GENERATE_URL ||
    'https://nftart-fct.vercel.app/api/generate',
    // 'http://localhost:4000/api/generate',
}
