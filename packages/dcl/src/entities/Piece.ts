import config from '../config'
import { AvantGardeToken } from '../graphql'

export class Piece extends Entity {
  static Transformations: Transform[] = [
    new Transform({
      position: new Vector3(11, 3, 4),
      rotation: Quaternion.Euler(0, -30, 0),
    }),
    new Transform({
      position: new Vector3(14, 3, 6),
      rotation: Quaternion.Euler(0, -60, 0),
    }),
    new Transform({
      position: new Vector3(15, 3, 9),
      rotation: Quaternion.Euler(0, -90, 0),
    }),
    new Transform({
      position: new Vector3(8, 3, 3),
      rotation: Quaternion.Euler(0, 0, 0),
    }),
    new Transform({
      position: new Vector3(5, 3, 4),
      rotation: Quaternion.Euler(0, 30, 0),
    }),
    new Transform({
      position: new Vector3(3, 3, 6),
      rotation: Quaternion.Euler(0, 60, 0),
    }),
    new Transform({
      position: new Vector3(2, 3, 9),
      rotation: Quaternion.Euler(0, 90, 0),
    }),
  ]

  placeholder: Entity

  constructor(transform: Transform, avantGardeToken: AvantGardeToken) {
    super()
    this.addComponent(new GLTFShape('models/cadre.glb'))
    transform.scale = new Vector3(0.8, 0.8, 0.8)
    this.addComponent(transform)
    engine.addEntity(this)
    this.placeholder = new Entity()
    this.placeholder.setParent(this)
    this.placeholder.addComponent(new CylinderShape())
    const myMaterial = new Material()
    myMaterial.albedoTexture = new Texture(
      `${config.ipfsEndpoint}${
        avantGardeToken.metadata?.image.split('ipfs://')[1]
      }`
    )
    this.placeholder.addComponent(myMaterial)
    this.placeholder.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.09),
        scale: new Vector3(1.7, 0.001, 1.7),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    this.placeholder.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL(`${avantGardeToken.metadata?.external_url}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open details`,
          distance: 4,
        }
      )
    )
    engine.addEntity(this.placeholder)
  }
}
