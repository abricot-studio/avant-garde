import { movePlayerTo } from '@decentraland/RestrictedActions'

export class Teleporter extends Entity {
  constructor() {
    super()
    const model = new BoxShape()

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(29, 2, 14),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.1, 1, 1),
    })
    this.addComponent(transform)
    engine.addEntity(this)

    const plan = new Entity()
    const modelPlan = new BoxShape()

    plan.addComponent(modelPlan)
    const transformPlan = new Transform({
      position: new Vector3(16, 15, 0),
      scale: new Vector3(20, 0.1, 20),
    })
    plan.addComponent(transformPlan)

    this.addComponentOrReplace(
      new OnPointerDown(async (e) => {}, {
        button: ActionButton.POINTER,
        hoverText: `Access restricted to minter only!`,
        distance: 3,
        showFeedback: true,
      })
    )

    engine.addEntity(plan)
  }

  activate() {
    this.addComponentOrReplace(
      new OnPointerDown(
        async (e) => {
          await movePlayerTo({ x: 24, y: 17, z: 8 }, { x: 16, y: 17, z: 0 })
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Go to minter only room!`,
          distance: 3,
          showFeedback: true,
        }
      )
    )
  }
}
