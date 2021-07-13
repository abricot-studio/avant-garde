import config from '../config'
import { mintParams } from '../generate'
import { AvantGardeToken } from '../graphql'
import { formatEther } from '../utils'

export class Minter extends Entity {
  placeholder: Entity
  mintCard: Entity
  loadingTexture?: VideoTexture
  loadingMaterial?: BasicMaterial
  price?: Entity
  priceText?: TextShape
  pricePlatform?: Entity
  priceTextPlatform?: TextShape
  userPiece?: AvantGardeToken
  twitter: Entity
  discord: Entity

  constructor(userPiece?: AvantGardeToken) {
    super()
    this.userPiece = userPiece
    this.addComponent(new GLTFShape('models/cadre.glb'))
    this.addComponent(
      new Transform({
        position: new Vector3(0, 5, 0),
      })
    )
    engine.addEntity(this)

    this.mintCard = new Entity()
    this.mintCard.addComponent(
      new Transform({
        position: new Vector3(0, -3, 0),
      })
    )
    this.mintCard.setParent(this)
    engine.addEntity(this.mintCard)

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

    this.twitter = new Entity()
    this.twitter.setParent(this)
    this.twitter.addComponent(new GLTFShape('models/twitterBtn.glb'))
    this.twitter.addComponent(
      new Transform({
        position: new Vector3(1.3, -1.4, 0.2),
        rotation: Quaternion.Euler(0, -90, 0)
      })
    )
    this.twitter.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(config.twitterUrl)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open`,
          distance: 8,
        }
      )
    )
    engine.addEntity(this.twitter)

    this.discord = new Entity()
    this.discord.setParent(this)
    this.discord.addComponent(new GLTFShape('models/discordBtn.glb'))
    this.discord.addComponent(
      new Transform({
        position: new Vector3(-1.3, -1.4, 0.2),
        rotation: Quaternion.Euler(0, -90, 0)
      })
    )
    this.discord.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(config.discordUrl)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open`,
          distance: 8,
        }
      )
    )
    engine.addEntity(this.discord)
    this.addComponent(new Billboard(false, true, false))

    if(this.userPiece){
      this.minted()
    } else {
      this.mintCard.addComponent(new GLTFShape('models/mintCard.glb'))
      this.loadingTexture = new VideoTexture(new VideoClip(config.loadingUrl))
      this.loadingMaterial = new BasicMaterial()
      this.loadingMaterial.texture = this.loadingTexture

      this.price = new Entity()
      this.price.addComponent(
        new Transform({
          position: new Vector3(-0.45, -2.85, 0.2),
          rotation: Quaternion.Euler(0, 180, 0),
        })
      )
      this.priceText = new TextShape('')
      this.priceText.hTextAlign = 'left'
      this.priceText.fontSize = 1
      this.priceText.font = new Font(Fonts.SanFrancisco_Heavy)
      this.priceText.color = Color3.Black()
      this.price.addComponent(this.priceText)
      this.price.setParent(this)
      engine.addEntity(this.price)

      this.pricePlatform = new Entity()
      this.pricePlatform.addComponent(
        new Transform({
          position: new Vector3(-0.45, -3.14, 0.2),
          rotation: Quaternion.Euler(0, 180, 0),
        })
      )
      this.priceTextPlatform = new TextShape('')
      this.priceTextPlatform.hTextAlign = 'left'
      this.priceTextPlatform.fontSize = 1
      this.priceTextPlatform.font = new Font(Fonts.SanFrancisco_Heavy)
      this.priceTextPlatform.color = Color3.Black()
      this.pricePlatform.addComponent(this.priceTextPlatform)
      this.pricePlatform.setParent(this)
      engine.addEntity(this.pricePlatform)
    }

  }

  loading() {
    this.placeholder.getComponent(Transform).scale = new Vector3(
      2.5,
      0.001,
      2.5
    )
    if(this.loadingMaterial && this.loadingTexture){
      this.placeholder.addComponentOrReplace(this.loadingMaterial)
      this.loadingTexture.loop = true
      this.loadingTexture.play()
    }

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

  minted(){

    if(this.userPiece){
      if(this.priceText && this.priceTextPlatform){
        this.priceText.value = ''
        this.priceTextPlatform.value = ''
      }

      if(!this.loadingTexture){
        this.placeholder.getComponent(Transform).scale = new Vector3(
          1.8,
          0.001,
          1.8
        )
        const myTexture = new Texture(
          `${config.ipfsEndpoint}${this.userPiece.metadata?.image.split('ipfs://')[1]}`
        )
        const myMaterial = new Material()
        myMaterial.albedoTexture = myTexture
        this.placeholder.addComponentOrReplace(myMaterial)
      }
      this.mintCard.addComponentOrReplace(new GLTFShape('models/aftermintCard.glb') )

      const mintDate = new Entity()
      mintDate.addComponent(
        new Transform({
          position: new Vector3(-0.2, -2.84, 0.2),
          rotation: Quaternion.Euler(0, 180, 0),
        })
      )
      const mintDateText = new TextShape(new Date(parseInt(this.userPiece.mintTimestamp) * 1000).toISOString().split('T')[0])
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
      const mintPriceText = new TextShape(formatEther(this.userPiece.mintPrice || '0').toString())
      mintPriceText.hTextAlign = 'left'
      mintPriceText.fontSize = 1
      mintPriceText.fontWeight = 'bold'
      mintPriceText.font = new Font(Fonts.SanFrancisco_Heavy)
      mintPriceText.color = Color3.Black()
      mintPrice.addComponent(mintPriceText)
      mintPrice.setParent(this)
      engine.addEntity(mintPrice)

      this.placeholder.addComponentOrReplace(
        new OnPointerDown(
          () => {
            openExternalURL(
              `${this.userPiece?.metadata?.external_url}`
            )
          },
          {
            button: ActionButton.POINTER,
            hoverText: `Open details`,
            distance: 8,
          }
        )
      )

      this.twitter.getComponent(OnPointerDown).callback = () => {
        openExternalURL(config.tweet(this?.userPiece?.id))
      }
    }
  }
}
