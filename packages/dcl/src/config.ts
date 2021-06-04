interface config {
  subgraphUrl: string
  ipfsEndpoint: string
  generateUrl: string
  loadingUrl: string
  poapSeverUrl: string
  poapEventId: string
}

const Config: config = {
  subgraphUrl:
    'https://api.thegraph.com/subgraphs/name/abricot-studio/avant-garde-rinkeby',
  ipfsEndpoint: 'https://gateway.pinata.cloud/ipfs/',
  // ipfsEndpoint:
  //   'https://corsanywherepinata.herokuapp.com/https://gateway.pinata.cloud/ipfs/',
  // generateUrl: 'http://localhost:3001/api/generate',
  generateUrl: 'https://avantgardebeta-fct.vercel.app/api/generate',
  loadingUrl: 'https://beta.avant-garde.gallery/avantgarde.webm',
  poapSeverUrl: 'poapapi.dcl.guru',
  poapEventId: '2369',
}

export default Config
