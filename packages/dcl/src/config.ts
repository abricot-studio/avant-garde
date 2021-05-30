interface config {
  subgraphUrl: string
  ipfsEndpoint: string
  generateUrl: string
}

const Config: config = {
  subgraphUrl:
    'https://api.thegraph.com/subgraphs/name/abricot-studio/avant-garde-rinkeby',
  ipfsEndpoint:
    'https://corsanywherepinata.herokuapp.com/https://gateway.pinata.cloud/ipfs/',
  generateUrl: 'https://avantgardebeta-fct.vercel.app/api/generate',
  // generateUrl: 'http://localhost:3001/api/generate',
}

export default Config
