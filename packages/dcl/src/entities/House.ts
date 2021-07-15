import { Invitation } from './invitation'

export class House extends Entity {
  invitation: Entity

  constructor() {
    super()
    const model = new GLTFShape('models/house.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(0, 0, 0),
      rotation: Quaternion.Euler(0, -90, 0),
    })
    this.addComponent(transform)
    engine.addEntity(this)
    this.invitation = new Invitation()

    const wearable = new Entity()
    const modelWearable = new GLTFShape('models/wearableVIP.glb')

    wearable.addComponent(modelWearable)
    wearable.addComponent(new Transform({
      position: new Vector3(12, 0, 7),
    }))
    engine.addEntity(wearable)
  }
}
