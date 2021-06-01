import config from '../config'
import { mintParams } from '../generate'

export class Minter extends Entity {
  placeholder: Entity
  loadingTexture: VideoTexture
  loadingMaterial: BasicMaterial

  constructor() {
    super()
    this.loadingTexture = new VideoTexture(new VideoClip(config.loadingUrl))
    this.loadingTexture.loop = true
    this.loadingTexture.play()
    this.loadingMaterial = new BasicMaterial()
    this.loadingMaterial.texture = this.loadingTexture
    this.addComponent(new GLTFShape('models/cadre.glb'))
    this.addComponent(
      new Transform({
        position: new Vector3(8, 3, 8),
      })
    )
    engine.addEntity(this)
    this.placeholder = new Entity()
    this.placeholder.addComponent(new CylinderShape())
    const myMaterial = new Material()
    myMaterial.albedoColor = new Color4(0, 0, 0, 0)
    myMaterial.castShadows = false
    this.placeholder.addComponent(myMaterial)
    this.placeholder.addComponent(
      new Transform({
        position: new Vector3(8, 3, 8.09),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    engine.addEntity(this.placeholder)
  }

  loading() {
    this.placeholder.addComponentOrReplace(this.loadingMaterial)
    this.placeholder.getComponent(Transform).scale = new Vector3(
      2.5,
      0.001,
      2.5
    )
  }

  addPiece(mintParams: mintParams) {
    this.placeholder.getComponent(Transform).scale = new Vector3(
      1.8,
      0.001,
      1.8
    )
    const myTexture = new Texture(
      `${config.ipfsEndpoint}${mintParams.ipfsHashImage}`
    )
    const myMaterial = new Material()
    myMaterial.albedoTexture = myTexture
    this.placeholder.addComponentOrReplace(myMaterial)
  }
}
