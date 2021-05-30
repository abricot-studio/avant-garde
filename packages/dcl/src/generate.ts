import config from './config'
import { wait } from './utils'

export interface mintParams {
  status: string
  ipfsHashMetadata: string
  ipfsHashImage: string
  signature: string
  signerAddress: string
}

export async function Generate(address: string): Promise<mintParams> {
  return executeTask(async () => {
    const response = await fetch(config.generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    })
    const mintParams: mintParams = await response.json()

    if (mintParams.status === 'processing') {
      await wait(5000)
      return Generate(address)
    }

    return mintParams
  })
}
