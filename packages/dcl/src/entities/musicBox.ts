
export class MusicBox extends Entity {

  constructor() {
    super()
    const model = new GLTFShape('models/boiteAMusic.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(-11, 1, 11),
      rotation: Quaternion.Euler(0, -90, 0),
    })
    this.addComponent(transform)
    engine.addEntity(this)
    // const streamSource = new Entity()
    // streamSource.addComponent(
    //   new AudioStream(
    //     'http://localhost:8000/live/stream1/index.m3u8'
    //   )
    // )
    // engine.addEntity(streamSource)
  }
}
