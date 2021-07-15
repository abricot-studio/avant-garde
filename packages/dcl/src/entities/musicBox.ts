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
    engine.addEntity(this)

    const sonCard = new Entity()
    const modelCard = new GLTFShape('models/sonCard.glb')

    sonCard.addComponent(modelCard)
    sonCard.addComponent(new Transform({
      position: new Vector3(-11, 3, 11),
      rotation: Quaternion.Euler(0, -70, 0),
    }))
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

    const myVideoClip = new VideoClip(stream)
    let myVideoTexture = new VideoTexture(myVideoClip)
    const myMaterial = new BasicMaterial()
    myMaterial.texture = myVideoTexture
    const screen = new Entity()
    screen.addComponent(new PlaneShape())
    screen.addComponent(
      new Transform({
        scale: new Vector3(0, 0, 0),
      })
    )
    screen.addComponent(myMaterial)
    engine.addEntity(screen)
    myVideoTexture.playing = true
  }
}
