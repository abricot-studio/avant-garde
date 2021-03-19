import { config } from '@libs/config'
import { Model } from './model'
import { Render } from './render'

export default async function generate(
  address: string,
  render: Render,
  tf: typeof import('@tensorflow/tfjs')
): Promise<any> {
  const seed = parseInt(address, 16) / 1000000000000000000000
  const inputShape = [config.image.width, config.image.height]

  const model = new Model(
    inputShape,
    config.image.blackWhite,
    config.image.scale,
    config.image.batchSize,
    32,
    8,
    tf,
    seed
  )
  const dataImg = model.generate()
  const path = await render.draw(dataImg, address)

  return path
}
