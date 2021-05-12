import axios from 'axios'
import config from '../config'

const { ipfsEndpoint } = config

export function getIpfsUrl(uri) {
  const hash = uri.replace('ipfs://', '')
  return `${ipfsEndpoint}${hash}`
}

export async function getIpfsData(uri) {
  const url = getIpfsUrl(uri)
  const res = await axios.get(url)
  return res.data
}
