import config from '../config'

export class BeforeLaunchHouse extends Entity {
  twitter: Entity
  discord: Entity
  register: Entity

  constructor() {
    super()

    this.addComponent(new GLTFShape('models/beforeLaunchScene.glb'))
    const transform = new Transform({
      position: new Vector3(0, 0, 0),
      // rotation: Quaternion.Euler(0, -90, 0),
    })
    this.addComponent(transform)
    engine.addEntity(this)

    this.twitter = new Entity()
    this.twitter.addComponent(new GLTFShape('models/twitter.glb'))
    this.twitter.addComponent(
      new Transform({
        position: new Vector3(0, 0.9, 0),
      })
    )
    this.twitter.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${config.twitterUrl}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open`,
          distance: 10,
        }
      )
    )
    engine.addEntity(this.twitter)

    this.discord = new Entity()
    this.discord.addComponent(new GLTFShape('models/discord.glb'))
    this.discord.addComponent(
      new Transform({
        position: new Vector3(0, 0.9, 0),
      })
    )
    this.discord.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${config.discordUrl}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Open`,
          distance: 10,
        }
      )
    )
    engine.addEntity(this.discord)

    this.register = new Entity()
    this.register.addComponent(new GLTFShape('models/register.glb'))
    this.register.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
      })
    )
    this.register.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(`${config.registerUrl}`)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Register`,
          distance: 10,
        }
      )
    )
    engine.addEntity(this.register)
  }
}
