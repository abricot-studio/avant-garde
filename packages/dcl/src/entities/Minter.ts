export class Minter extends Entity {

  constructor(position: Vector3) {

    super()
    const model = new BoxShape()

    model.withCollisions = true
    this.addComponent(model)

    const transform = new Transform({
      position: position,
      scale: new Vector3(2, 2, 0.04),
    })
    this.addComponent(transform)
    engine.addEntity(this)

  }

}
