import config from './config'

export interface mintParams {
  status: string,
  ipfsHashMetadata: string
  ipfsHashImage: string
  signature: string
  signerAddress: string
}

export async function Generate(address: string): Promise<mintParams>{

  return executeTask(async () => {
    const response = await fetch(config.generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address })
    })
    const mintParams: mintParams = await response.json()
    return mintParams
  })

}
