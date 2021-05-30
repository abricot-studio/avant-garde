import config from '../config'
import { mintParams } from '../generate'

export class Minter extends Entity {
  constructor(position: Vector3) {
    super()
    const model = new BoxShape()

    model.withCollisions = true
    this.addComponent(model)

    const transform = new Transform({
      position: position,
      scale: new Vector3(2, 2, 0.04),
    })
    this.addComponent(transform)
    engine.addEntity(this)
  }

  addPiece(mintParams: mintParams) {
    const myTexture = new Texture(
      `${config.ipfsEndpoint}${mintParams.ipfsHashImage}`
    )
    const myMaterial = new Material()
    myMaterial.albedoTexture = myTexture
    this.addComponent(myMaterial)
  }
}
