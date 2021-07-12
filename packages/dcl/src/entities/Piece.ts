import config from '../config'
import { AvantGardeToken } from '../graphql'
import { formatEther } from '../utils'

export class Piece extends Entity {
  static Transformations: Transform[] = [
    new Transform({
      position: new Vector3(-8.24, 4, -7.85),
      rotation: Quaternion.Euler(0, -55, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),
    new Transform({
      position: new Vector3(-6.25, 4, -5.17),
      rotation: Quaternion.Euler(0, -50, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),
    new Transform({
      position: new Vector3(-3.9, 4, -2.79),
      rotation: Quaternion.Euler(0, -40, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),

    new Transform({
      position: new Vector3(-7.86, 4, 8.24),
      rotation: Quaternion.Euler(0, 33, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),
    new Transform({
      position: new Vector3(-5.08, 4, 6.2),
      rotation: Quaternion.Euler(0, 40, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),
    new Transform({
      position: new Vector3(-2.62, 4, 3.69),
      rotation: Quaternion.Euler(0, 50, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),

    new Transform({
      position: new Vector3(8.4, 4, 8.08),
      rotation: Quaternion.Euler(0, -56, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),
    new Transform({
      position: new Vector3(6.61, 4, 5.56),
      rotation: Quaternion.Euler(0, -52, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),
    new Transform({
      position: new Vector3(4.56, 4, 3.36),
      rotation: Quaternion.Euler(0, -43, 0),
      scale: new Vector3(0.625, 0.625, 0.625),
    }),
  ]

  placeholder1: Entity
  mintCard?: Entity
  placeholder2: Entity
  avantGardeToken1: AvantGardeToken
  avantGardeToken2?: AvantGardeToken

  constructor(
    transform: Transform,
    avantGardeToken1: AvantGardeToken,
    avantGardeToken2?: AvantGardeToken
  ) {
    super()
    this.avantGardeToken1 = avantGardeToken1
    this.avantGardeToken2 = avantGardeToken2

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
    this.refreshPlaceholder1()
    this.refreshPlaceholder2()
    engine.addEntity(this.placeholder1)
    engine.addEntity(this.placeholder2)
  }

  refreshPlaceholder1() {
    const myMaterial1 = new Material()
    myMaterial1.albedoTexture = new Texture(
      `${config.ipfsEndpoint}${
        this.avantGardeToken1.metadata?.image.split('ipfs://')[1]
      }`
    )
    this.placeholder1.addComponentOrReplace(myMaterial1)
    this.placeholder1.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${this.avantGardeToken1.metadata?.external_url}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open details`,
          distance: 6,
        }
      )
    )
  }

  refreshPlaceholder2() {
    if (this.avantGardeToken2) {
      const myMaterial2 = new Material()
      myMaterial2.albedoTexture = new Texture(
        `${config.ipfsEndpoint}${
          this.avantGardeToken2.metadata?.image.split('ipfs://')[1]
        }`
      )
      this.placeholder2.addComponentOrReplace(myMaterial2)
      this.placeholder2.addComponentOrReplace(
        new OnPointerDown(
          () => {
            openExternalURL(`${this.avantGardeToken2?.metadata?.external_url}`)
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
  minted(userPiece: AvantGardeToken){
    this.mintCard = new Entity()
    this.mintCard.addComponentOrReplace(new GLTFShape('models/aftermintCard.glb') )
    this.mintCard.addComponent(
      new Transform({
        position: new Vector3(0, -3, 0),
      })
    )
    this.mintCard.setParent(this)
    engine.addEntity(this.mintCard)

    const mintDate = new Entity()
    mintDate.addComponent(
      new Transform({
        position: new Vector3(-0.2, -2.84, 0.2),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    const mintDateText = new TextShape(new Date(parseInt(userPiece.mintTimestamp) * 1000).toISOString().split('T')[0])
    mintDateText.hTextAlign = 'left'
    mintDateText.fontSize = 1
    mintDateText.font = new Font(Fonts.SanFrancisco_Heavy)
    mintDateText.color = Color3.Black()
    mintDate.addComponent(mintDateText)
    mintDate.setParent(this)
    engine.addEntity(mintDate)

    const mintPrice = new Entity()
    mintPrice.addComponent(
      new Transform({
        position: new Vector3(-0.4, -3.13, 0.2),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    const mintPriceText = new TextShape(formatEther(userPiece.mintPrice || '0').toString())
    mintPriceText.hTextAlign = 'left'
    mintPriceText.fontSize = 1
    mintPriceText.fontWeight = 'bold'
    mintPriceText.font = new Font(Fonts.SanFrancisco_Heavy)
    mintPriceText.color = Color3.Black()
    mintPrice.addComponent(mintPriceText)
    mintPrice.setParent(this)
    engine.addEntity(mintPrice)

  }
}
