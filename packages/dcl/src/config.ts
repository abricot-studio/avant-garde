interface config {
  subgraphUrl: string
  ipfsEndpoint: string
  generateUrl: string
  loadingUrl: string
  registerUrl: string
  discordUrl: string
  twitterUrl: string
  poapSeverUrl: string
  poapEventId: string
}

const Config: config = {
  subgraphUrl:
    'https://api.thegraph.com/subgraphs/name/abricot-studio/avant-garde-rinkeby',
  // ipfsEndpoint: 'https://gateway.pinata.cloud/ipfs/',
  ipfsEndpoint:
    'https://corsanywherepinata.herokuapp.com/https://gateway.pinata.cloud/ipfs/',
  // generateUrl: 'http://localhost:3001/api/generate',
  // generateUrl: 'https://avantgarde-fct-git-invite-abricot-studio.vercel.app/api/generate',
  generateUrl: 'https://api.avant-garde.gallery/api/generate',
  loadingUrl: 'https://beta.avant-garde.gallery/avantgarde.webm',
  registerUrl: 'https://beta.avant-garde.gallery',
  discordUrl: 'https://discord.gg/tQbXBBcpTD',
  twitterUrl: 'https://twitter.com/avantgardenft',
  poapSeverUrl: 'poapapi.dcl.guru',
  poapEventId: '2369',
}

export default Config
