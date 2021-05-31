export class House extends Entity {
  constructor(position: Vector3) {
    super()
    const model = new GLTFShape('models/house.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: position,
      scale: new Vector3(1, 1, 1),
      // rotation: Quaternion.Euler(0,0,0)
    })
    this.addComponent(transform)
    engine.addEntity(this)
  }
}
