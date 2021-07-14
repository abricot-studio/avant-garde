
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
    const streamSource = new Entity()
    streamSource.addComponent(
      new AudioStream(stream)
    )
    streamSource.setParent(this)
    engine.addEntity(streamSource)
  }
}
