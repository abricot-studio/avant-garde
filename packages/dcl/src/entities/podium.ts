export class Podium extends Entity {
  constructor() {
    super()
    const model = new GLTFShape('models/podium.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(16, 0, 0),
    })
    this.addComponent(transform)
    engine.addEntity(this)
  }
}
