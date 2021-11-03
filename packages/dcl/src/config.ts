interface config {
  subgraphUrl: string
  ipfsEndpoint: string
  generateUrl: string
  loadingUrl: string
  registerUrl: string
  invitationsUrl: string
  discordUrl: string
  twitterUrl: string
  tweet: Function
  poapSeverUrl: string
  poapEventId: string
  streamUrl: string
  soundcloudUrl: string
}

const Config: config = {
  subgraphUrl:
    // 'https://api.thegraph.com/subgraphs/name/abricot-studio/avant-garde-rinkeby',
    'https://api.thegraph.com/subgraphs/name/abricot-studio/avant-garde-mainnet',
  // ipfsEndpoint: 'https://gateway.pinata.cloud/ipfs/',
  ipfsEndpoint: 'https://cloudflare-ipfs.com/ipfs/',
  // ipfsEndpoint: 'https://corsanywherepinata.herokuapp.com/https://gateway.pinata.cloud/ipfs/',
  // generateUrl: 'http://localhost:3001/api/generate',
  // generateUrl: 'https://avantgarde-fct-git-dev-abricot-studio.vercel.app/api/generate',
  generateUrl: 'https://api.avant-garde.gallery/api/generate',
  loadingUrl: 'https://avant-garde.gallery/avantgarde.webm',
  registerUrl: 'https://avant-garde.gallery',
  invitationsUrl: 'https://avant-garde.gallery/myInvitations',
  discordUrl: 'https://discord.gg/tQbXBBcpTD',
  twitterUrl: 'https://twitter.com/avantgardenft',
  tweet: (tokenId: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Look at this unique #generativeart I created!💘

Join the other AvantGardists to discover your personalized AvantGarde #NFT, 🔥
generated by a deep-learning algorithm🎨

https://avant-garde.gallery/token/${tokenId}

#NFTs #nftart #abstractart #NFTartist #NFTCommunity #cryptoart #NFTcollectibles #art`)}`,
  poapSeverUrl: 'poapapi.dcl.guru',
  poapEventId: '3669',
  // streamUrl: 'https://stream.avant-garde.gallery:8443/live/stream1/index.m3u8',
  streamUrl: 'https://docs.google.com/uc?export=open&id=1BQOdR_qSz7H9dL5EMfk8R6PsUKcf4l5H',
  soundcloudUrl: 'https://soundcloud.com/radiobato',
}

export default Config
