
export class MusicBox extends Entity {

  constructor(stream: string) {
    super()
    const model = new GLTFShape('models/boiteAMusic.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(-11, 0.5, 11),
      rotation: Quaternion.Euler(0, -90, 0),
    })
    this.addComponent(transform)
    engine.addEntity(this)

    const myVideoClip = new VideoClip(stream)
    let myVideoTexture = new VideoTexture(myVideoClip)
    const myMaterial = new BasicMaterial()
    myMaterial.texture = myVideoTexture
    const screen = new Entity()
    screen.addComponent(new PlaneShape())
    screen.addComponent(
      new Transform({
        scale: new Vector3(0,0,0),
      })
    )
    screen.addComponent(myMaterial)
    engine.addEntity(screen)
    myVideoTexture.playing = true
  }
}
