import config from '../config'

const { ipfsEndpoint } = config

export function getIpfsUrl(uri) {
  const hash = uri.replace('ipfs://', '')
  return `${ipfsEndpoint}${hash}`
}
