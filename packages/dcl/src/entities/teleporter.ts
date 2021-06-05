import { movePlayerTo } from '@decentraland/RestrictedActions'

export class Teleporter extends Entity {
  constructor() {
    super()
    const model = new BoxShape()

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(14, 2, 14),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.1, 1, 1),
    })
    this.addComponent(transform)
    engine.addEntity(this)

    this.addComponentOrReplace(
      new OnPointerDown(async (e) => {}, {
        button: ActionButton.POINTER,
        hoverText: `Access restricted to minter only!`,
        distance: 3,
        showFeedback: true,
      })
    )

  }

  activate() {
    this.addComponentOrReplace(
      new OnPointerDown(
        async (e) => {
          await movePlayerTo({ x: 13, y: 25, z: 13 }, { x: 0, y: 25, z: 0 })
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
