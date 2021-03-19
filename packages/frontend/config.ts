export default {
  infuraId:
    process.env.NEXT_PUBLIC_INFURA_ID || '781d8466252d47508e177b8637b1c2fd',
  ipfsEndpoint:
    process.env.NEXT_PUBLIC_IPFS_ENDPOINT ||
    'https://gateway.pinata.cloud/ipfs/',
  subgraphUrl:
    process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
    'http://127.0.0.1:8000/subgraphs/name/pakokrew/arbart',
  generateUrl:
    process.env.NEXT_PUBLIC_GENERATE_URL ||
    'https://nftart-fct.vercel.app/api/generate',
    // 'http://localhost:4000/api/generate',
  contractAddress:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    '0x5fbdb2315678afecb367f032d93f642f64180aa3',
}
