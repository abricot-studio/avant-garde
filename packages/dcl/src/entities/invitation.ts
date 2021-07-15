import config from '../config'

export class Invitation extends Entity {
  twitter: Entity
  discord: Entity

  constructor() {
    super()

    const model = new GLTFShape('models/cadre.glb')
    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(0, 24, 0),
      rotation: Quaternion.Euler(0, 0, 0),
    })
    this.addComponent(transform)
    this.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${config.invitationsUrl}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Get invites`,
          distance: 8,
        }
      )
    )
    engine.addEntity(this)

    const textEntity = new Entity()
    const modelTexture = new GLTFShape('models/invitationTextureVIP.glb')
    textEntity.addComponent(modelTexture)
    const transformTexture = new Transform({
      position: new Vector3(0, 0, 0.1),
      rotation: Quaternion.Euler(0, 180, 0),
    })
    textEntity.addComponent(transformTexture)
    textEntity.setParent(this)
    engine.addEntity(textEntity)

    this.twitter = new Entity()
    this.twitter.setParent(this)
    this.twitter.addComponent(new GLTFShape('models/twitterBtn.glb'))
    this.twitter.addComponent(
      new Transform({
        position: new Vector3(1.3, -1.4, 0.2),
        rotation: Quaternion.Euler(0, -90, 0),
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
        rotation: Quaternion.Euler(0, -90, 0),
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
  }
}
