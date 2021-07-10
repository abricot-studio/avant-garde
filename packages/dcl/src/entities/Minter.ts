import config from '../config'
import { mintParams } from '../generate'

export class Minter extends Entity {
  placeholder: Entity
  mintCard: Entity
  loadingTexture: VideoTexture
  loadingMaterial: BasicMaterial
  price: Entity
  priceText: TextShape
  pricePlatform: Entity
  priceTextPlatform: TextShape

  constructor() {
    super()
    this.addComponent(new GLTFShape('models/cadre.glb'))
    this.addComponent(
      new Transform({
        position: new Vector3(0, 4.5, 0),
      })
    )
    engine.addEntity(this)

    this.loadingTexture = new VideoTexture(new VideoClip(config.loadingUrl))
    this.loadingMaterial = new BasicMaterial()
    this.loadingMaterial.texture = this.loadingTexture

    this.placeholder = new Entity()
    this.placeholder.addComponent(new CylinderShape())
    const myMaterial = new Material()
    myMaterial.albedoColor = new Color4(0, 0, 0, 0)
    myMaterial.castShadows = false
    this.placeholder.addComponent(myMaterial)
    this.placeholder.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.09),
        scale: new Vector3(2.5, 0.001, 2.5),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    this.placeholder.setParent(this)
    engine.addEntity(this.placeholder)

    this.mintCard = new Entity()
    this.mintCard.addComponent(new GLTFShape('models/mintCard.glb'))
    this.mintCard.addComponent(
      new Transform({
        position: new Vector3(0, -3, 0),
      })
    )
    this.mintCard.setParent(this)
    engine.addEntity(this.mintCard)

    this.price = new Entity()
    this.price.addComponent(
      new Transform({
        position: new Vector3(-0.55, -2.85, 0.2),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    this.priceText = new TextShape('')
    this.priceText.hTextAlign = 'left'
    this.priceText.fontSize = 1
    this.priceText.font = new Font(Fonts.LiberationSans)
    this.priceText.color = Color3.Black()
    this.price.addComponent(this.priceText)
    this.price.setParent(this)
    engine.addEntity(this.price)

    this.pricePlatform = new Entity()
    this.pricePlatform.addComponent(
      new Transform({
        position: new Vector3(-0.55, -3.15, 0.2),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    this.priceTextPlatform = new TextShape('')
    this.priceTextPlatform.hTextAlign = 'left'
    this.priceTextPlatform.fontSize = 1
    this.priceTextPlatform.font = new Font(Fonts.LiberationSans)
    this.priceTextPlatform.color = Color3.Black()
    this.pricePlatform.addComponent(this.priceTextPlatform)
    this.pricePlatform.setParent(this)
    engine.addEntity(this.pricePlatform)

    this.addComponent(new Billboard(false, true, false))
  }

  loading() {
    this.placeholder.getComponent(Transform).scale = new Vector3(
      2.5,
      0.001,
      2.5
    )
    this.placeholder.addComponentOrReplace(this.loadingMaterial)
    this.loadingTexture.loop = true
    this.loadingTexture.play()
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
