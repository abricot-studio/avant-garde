import { sendRequest } from '@dcl/ecs-scene-utils'
import config from './config'
import { wait } from './utils'

export interface mintParams {
  status: string
  message?: string
  ipfsHashMetadata: string
  ipfsHashImage: string
  signature: string
  signerAddress: string
}

export async function Generate(address: string): Promise<mintParams> {
  return executeTask(async () => {
    const mintParams: mintParams = await sendRequest(
      config.generateUrl,
      'POST',
      {
        'Content-Type': 'application/json',
      },
      { address }
    )

    if (mintParams.status === 'processing') {
      await wait(5000)
      return Generate(address)
    }

    return mintParams
  })
}
