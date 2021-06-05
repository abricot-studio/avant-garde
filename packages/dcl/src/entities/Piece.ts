import config from '../config'
import { AvantGardeToken } from '../graphql'

export class Piece extends Entity {
  static Transformations: Transform[] = [
    new Transform({
      position: new Vector3(-8.24, 3.5, -7.85),
      rotation: Quaternion.Euler(0, -55, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),
    new Transform({
      position: new Vector3(-6.25, 3.5, -5.17),
      rotation: Quaternion.Euler(0, -50, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),
    new Transform({
      position: new Vector3(-3.9, 3.5, -2.79),
      rotation: Quaternion.Euler(0, -40, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),

    new Transform({
      position: new Vector3(-7.86, 3.5, 8.24),
      rotation: Quaternion.Euler(0, 33, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),
    new Transform({
      position: new Vector3(-5.08, 3.5, 6.2),
      rotation: Quaternion.Euler(0, 40, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),
    new Transform({
      position: new Vector3(-2.62, 3.5,3.69),
      rotation: Quaternion.Euler(0, 50, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),

    new Transform({
      position: new Vector3(8.40, 3.5, 8.08),
      rotation: Quaternion.Euler(0, -56, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),
    new Transform({
      position: new Vector3(6.61, 3.5, 5.56),
      rotation: Quaternion.Euler(0, -52, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),
    new Transform({
      position: new Vector3(4.56, 3.5, 3.36),
      rotation: Quaternion.Euler(0, -43, 0),
      scale: new Vector3(0.625, 0.625, 0.625)
    }),
  ]

  placeholder1: Entity
  placeholder2: Entity
  avantGardeToken: AvantGardeToken

  constructor(transform: Transform, avantGardeToken: AvantGardeToken) {
    super()
    this.avantGardeToken = avantGardeToken

    this.addComponent(new GLTFShape('models/cadre.glb'))
    this.addComponent(transform)
    engine.addEntity(this)

    this.placeholder1 = new Entity()
    this.placeholder1.setParent(this)
    this.placeholder1.addComponent(new CylinderShape())
    this.placeholder1.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.09),
        scale: new Vector3(1.7, 0.001, 1.7),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    this.placeholder2 = new Entity()
    this.placeholder2.setParent(this)
    this.placeholder2.addComponent(new CylinderShape())
    this.placeholder2.addComponent(
      new Transform({
        position: new Vector3(0, 0, -0.09),
        scale: new Vector3(1.7, 0.001, 1.7),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    this.refreshPlaceholder()
    engine.addEntity(this.placeholder1)
    engine.addEntity(this.placeholder2)

  }

  refreshPlaceholder() {
    const myMaterial = new Material()
    myMaterial.albedoTexture = new Texture(
      `${config.ipfsEndpoint}${
        this.avantGardeToken.metadata?.image.split('ipfs://')[1]
      }`
    )
    this.placeholder1.addComponentOrReplace(myMaterial)
    this.placeholder1.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${this.avantGardeToken.metadata?.external_url}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open details`,
          distance: 6,
        }
      )
    )
    this.placeholder2.addComponentOrReplace(myMaterial)
    this.placeholder2.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${this.avantGardeToken.metadata?.external_url}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open details`,
          distance: 6,
        }
      )
    )
  }
}
