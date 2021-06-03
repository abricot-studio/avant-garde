import { movePlayerTo } from '@decentraland/RestrictedActions'

export class Teleporter extends Entity {
  constructor() {
    super()
    const model = new BoxShape()

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(1, 2, 15),
      scale: new Vector3(0.1, 1, 1),
    })
    this.addComponent(transform)
    engine.addEntity(this)

    const plan = new Entity()
    const modelPlan = new BoxShape()

    plan.addComponent(modelPlan)
    const transformPlan = new Transform({
      position: new Vector3(8, 10, 8),
      scale: new Vector3(16, 0.1, 16),
    })
    plan.addComponent(transformPlan)

    this.addComponentOrReplace(new OnPointerDown(
      async (e) => {}, {
        button: ActionButton.POINTER,
        hoverText: `Access restricted to minter only!`,
        distance: 3,
        showFeedback: true
      }) )

    engine.addEntity(plan)

  }

  activate(){

    this.addComponentOrReplace(new OnPointerDown(
      async (e) => {

        await movePlayerTo({ x: 1, y: 12, z: 15 }, { x: 8, y: 12, z: 8 })
      }, {
        button: ActionButton.POINTER,
        hoverText: `Go to minter only room!`,
        distance: 3,
        showFeedback: true
      }) )

  }
}
