export class House extends Entity {
  constructor() {
    super()
    const model = new GLTFShape('models/box.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(8, 0, 8),
    })
    this.addComponent(transform)
    engine.addEntity(this)
  }
}
