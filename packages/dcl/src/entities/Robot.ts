export class Robot extends Entity {
  constructor(transform: Transform) {
    super()
    const model = new GLTFShape('models/robot.glb')

    this.addComponent(model)
    this.addComponent(transform)
    engine.addEntity(this)
  }
}
