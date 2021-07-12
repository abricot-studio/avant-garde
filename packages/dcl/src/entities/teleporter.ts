import { movePlayerTo } from '@decentraland/RestrictedActions'
import { TriggerBoxShape, TriggerComponent } from '@dcl/ecs-scene-utils'

export class Teleporter extends Entity {
  animations = [
    'avgCheckAction',
    'lightMulticolourAction'
  ]

  exited = true
  hover: string

  constructor(transform: Transform, hover: string) {
    super()
    const model = new GLTFShape('models/teleporter.glb')
    this.hover = hover
    this.addComponent(model)
    this.addComponent(transform)

    this.addComponentOrReplace(
      new OnPointerDown(async (e) => {}, {
        button: ActionButton.POINTER,
        hoverText: `Access restricted to AvantGardist minters only!`,
        distance: 4,
        showFeedback: true,
      })
    )
    this.addComponent(new Animator())
    this.animations.forEach((animation, i) => {
      const animationState = new AnimationState(animation, { layer: i })
      animationState.looping = false
      // animationState.playing = true
      this.getComponent(Animator).addClip(animationState)
      this.getComponent(Animator).getClip(animation).reset()
    })
    engine.addEntity(this)

  }


  activate(otherTeleporter: Teleporter) {

    log('activate')
    const shape = new TriggerBoxShape(new Vector3(1, 3, 1), new Vector3(0, 2, 0))

    this.addComponentOrReplace(

      new TriggerComponent(
        shape,
        {
          enableDebug: false,
          onCameraEnter: async () => {
            if(!this.exited){
              return false
            }
            log('onCameraEnter')
            const otherTeleporterPosition = otherTeleporter.getComponent(Transform).position
            otherTeleporter.exited = false
            otherTeleporter.animations.forEach(animation => {
              otherTeleporter.getComponent(Animator).getClip(animation).reset()
            })
            await movePlayerTo({ x: otherTeleporterPosition.x, y: otherTeleporterPosition.y + 1, z: otherTeleporterPosition.z }, { x: 0, y: otherTeleporterPosition.y + 1, z: 0 })
            otherTeleporter.animations.forEach(animation => {
              otherTeleporter.getComponent(Animator).getClip(animation).play()
            })
          },
          onCameraExit: () => {
            log('onCameraExit')
            this.exited = true
          }
        }
      )
    )
    this.addComponentOrReplace(
      new OnPointerDown(
        async (e) => {
          this.animations.forEach(animation => {
            this.getComponent(Animator).getClip(animation).play()
          })
        },
        {
          button: ActionButton.POINTER,
          hoverText: this.hover,
          distance: 4,
          showFeedback: true,
        }
      )
    )
  }

}
