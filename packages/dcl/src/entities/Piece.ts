import { AvantGardeToken } from '../graphql'
import config from '../config'

export class Piece extends Entity {

  constructor(position: Vector3, avantGardeToken: AvantGardeToken) {

    super()
    const model = new BoxShape()
    const myTexture = new Texture(`${config.ipfsEndpoint}${avantGardeToken.metadata?.image.split('ipfs://')[1]}`)

    const myMaterial = new Material()
    myMaterial.albedoTexture = myTexture
    this.addComponent(myMaterial)
    model.withCollisions = true
    this.addComponent(model)

    const transform = new Transform({
      position: position,
      scale: new Vector3(2, 2, 0.04),
      // rotation: Quaternion.Euler(0,0,0)
    })
    this.addComponent(transform)
    engine.addEntity(this)

  }

}
