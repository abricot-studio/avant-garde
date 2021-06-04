import config from '../config'
import { mintParams } from '../generate'

export class Minter extends Entity {
  placeholder: Entity
  loadingTexture: VideoTexture
  loadingMaterial: BasicMaterial
  price1: Entity
  price2: Entity
  priceText1: TextShape
  priceText2: TextShape

  constructor() {
    super()
    this.addComponent(new GLTFShape('models/cadre.glb'))
    this.addComponent(
      new Transform({
        position: new Vector3(8, 4, 8),
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
        scale: new Vector3(
          2.5,
          0.001,
          2.5),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    this.placeholder.setParent(this)
    engine.addEntity(this.placeholder)

    this.price1 = new Entity()
    this.price1.addComponent(new Transform({
      position: new Vector3(1, -2.5, 0.2),
      rotation: Quaternion.Euler(0, 180, 0),
    }))
    this.priceText1 = new TextShape('')
    this.priceText1.hTextAlign = 'left'
    this.priceText1.fontSize = 2
    // this.priceText1.font = new Font(Fonts.SanFrancisco)
    this.priceText1.font = new Font(Fonts.LiberationSans)
    this.priceText1.color = Color3.Black()
    this.priceText1.value = `
      💥 Price:
      Platform fees:
      `
    this.price1.addComponent(this.priceText1)
    this.price1.setParent(this)
    engine.addEntity(this.price1)

    this.price2 = new Entity()
    this.price2.addComponent(new Transform({
      position: new Vector3(-0.3, -2.5, 0.2),
      rotation: Quaternion.Euler(0, 180, 0),
    }))
    this.priceText2 = new TextShape('')
    this.priceText2.hTextAlign = 'left'
    this.priceText2.fontSize = 2
    // this.priceText2.font = new Font(Fonts.SanFrancisco)
    this.priceText2.font = new Font(Fonts.LiberationSans)
    this.priceText2.color = Color3.Black()
    this.price2.addComponent(this.priceText2)
    this.price2.setParent(this)
    engine.addEntity(this.price2)
    this.addComponent(new Billboard(false, true, false) )

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
