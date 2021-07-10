import { movePlayerTo } from '@decentraland/RestrictedActions'

export class Teleporter extends Entity {
  constructor() {
    super()
    // const model = new BoxShape()
    const model = new GLTFShape('models/teleporter.glb')

    this.addComponent(model)
    const transform = new Transform({
      position: new Vector3(-12, 0, -12),
      rotation: Quaternion.Euler(0, -70, 0),
    })
    this.addComponent(transform)
    engine.addEntity(this)

    this.addComponentOrReplace(
      new OnPointerDown(async (e) => {}, {
        button: ActionButton.POINTER,
        hoverText: `Access restricted to AvantGardist minters only!`,
        distance: 4,
        showFeedback: true,
      })
    )
  }

  activate() {
    this.addComponentOrReplace(
      new OnPointerDown(
        async (e) => {
          await movePlayerTo({ x: -12, y: 25, z: -12 }, { x: 0, y: 25, z: 0 })
        },
        {
          button: ActionButton.POINTER,
          hoverText: `Go to AvantGardists lounge!`,
          distance: 4,
          showFeedback: true,
        }
      )
    )
  }
}
