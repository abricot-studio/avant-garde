import config from '../config'
import { AvantGardeToken } from '../graphql'

export class Piece extends Entity {
  static Transformations: Transform[] = [
    new Transform({
      position: new Vector3(10, 3, 0),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.8, 0.8, 0.8)
    }),
    new Transform({
      position: new Vector3(12, 3, 4),
      rotation: Quaternion.Euler(0, 120, 0),
      scale: new Vector3(0.8, 0.8, 0.8)
    }),
    new Transform({
      position: new Vector3(12, 3, -4),
      rotation: Quaternion.Euler(0, 60, 0),
      scale: new Vector3(0.8, 0.8, 0.8)
    }),
    new Transform({
      position: new Vector3(14, 3, 8),
      rotation: Quaternion.Euler(0, 150, 0),
      scale: new Vector3(0.8, 0.8, 0.8)
    }),
    new Transform({
      position: new Vector3(14, 3, -8),
      rotation: Quaternion.Euler(0, 30, 0),
      scale: new Vector3(0.8, 0.8, 0.8)
    }),
    new Transform({
      position: new Vector3(18, 3, 10),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(0.8, 0.8, 0.8)
    }),
    new Transform({
      position: new Vector3(18, 3, -10),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(0.8, 0.8, 0.8)
    }),
  ]

  placeholder: Entity
  avantGardeToken: AvantGardeToken

  constructor(transform: Transform, avantGardeToken: AvantGardeToken) {
    super()
    this.avantGardeToken = avantGardeToken

    this.addComponent(new GLTFShape('models/cadre.glb'))
    this.addComponent(transform)
    engine.addEntity(this)

    this.placeholder = new Entity()
    this.placeholder.setParent(this)
    this.placeholder.addComponent(new CylinderShape())
    this.placeholder.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.09),
        scale: new Vector3(1.7, 0.001, 1.7),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    this.refreshPlaceholder()
    engine.addEntity(this.placeholder)
  }

  refreshPlaceholder() {
    const myMaterial = new Material()
    myMaterial.albedoTexture = new Texture(
      `${config.ipfsEndpoint}${
        this.avantGardeToken.metadata?.image.split('ipfs://')[1]
      }`
    )
    this.placeholder.addComponentOrReplace(myMaterial)
    this.placeholder.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${this.avantGardeToken.metadata?.external_url}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open details`,
          distance: 4,
        }
      )
    )
  }
}
