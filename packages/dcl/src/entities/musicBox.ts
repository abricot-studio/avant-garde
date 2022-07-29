export class MusicBox extends Entity {
  constructor(stream: string, soundcloud: string) {
    super()
    const model = new GLTFShape('models/boiteAMusic.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(-11, 0.5, 11),
      rotation: Quaternion.Euler(0, -90, 0),
    })
    this.addComponent(transform)
    this.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(soundcloud)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Find more of their music on SoundCloud`,
          distance: 6,
        }
      )
    )
    engine.addEntity(this)

    const sonCard = new Entity()
    const modelCard = new GLTFShape('models/sonCard.glb')

    sonCard.addComponent(modelCard)
    sonCard.addComponent(
      new Transform({
        position: new Vector3(-11.5, 2.7, 12),
        rotation: Quaternion.Euler(0, -70, 0),
      })
    )
    sonCard.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(soundcloud)
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Find more of their music on SoundCloud`,
          distance: 6,
        }
      )
    )
    engine.addEntity(sonCard)

    const audioStream = new AudioStream(stream)
    audioStream.volume = 0.15
    const screen = new Entity()
    screen.addComponent(
      new Transform({
        scale: new Vector3(0, 0, 0),
      })
    )
    screen.addComponent(audioStream)
    engine.addEntity(screen)
    audioStream.playing = true
  }
}
