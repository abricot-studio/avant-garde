import {
  Delay,
  ScaleTransformComponent,
  TriggerBoxShape,
  TriggerComponent,
} from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import config from '../config'
import { AvantGardeToken } from '../graphql'

export class Teleporter extends Entity {
  animations = ['avgCheckAction', 'lightMulticolourAction']

  exited = true
  hover: string
  placeholder: Entity

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

    this.placeholder = new Entity()
    this.placeholder.addComponent(new CylinderShape())
    const myMaterial = new Material()
    myMaterial.albedoColor = new Color4(0, 0, 0, 0)
    myMaterial.castShadows = false
    this.placeholder.getComponent(CylinderShape).withCollisions = false
    this.placeholder.addComponent(myMaterial)
    this.placeholder.addComponent(
      new Transform({
        position: new Vector3(0.03, 1.65, 1.4),
        scale: new Vector3(0, 0, 0),
        rotation: Quaternion.Euler(90, 0, 0),
      })
    )
    this.placeholder.setParent(this)
    engine.addEntity(this.placeholder)
  }

  activate(otherTeleporter: Teleporter, userPiece: AvantGardeToken) {
    const shape = new TriggerBoxShape(
      new Vector3(1, 3, 1),
      new Vector3(0, 2, 0)
    )

    this.addComponentOrReplace(
      new TriggerComponent(shape, {
        enableDebug: false,
        onCameraEnter: async () => {
          if (!this.exited) {
            return false
          }
          const otherTeleporterPosition =
            otherTeleporter.getComponent(Transform).position
          otherTeleporter.placeholder.addComponentOrReplace(
            new ScaleTransformComponent(
              new Vector3(0.35, 0.001, 0.35),
              new Vector3(0, 0, 0),
              0.7
            )
          )
          otherTeleporter.placeholder.addComponentOrReplace(
            new Delay(5200, () => {
              otherTeleporter.placeholder.addComponentOrReplace(
                new ScaleTransformComponent(
                  otherTeleporter.placeholder.getComponent(Transform).scale,
                  new Vector3(0.35, 0.001, 0.35),
                  1
                )
              )
            })
          )
          otherTeleporter.exited = false
          otherTeleporter.animations.forEach((animation) => {
            otherTeleporter.getComponent(Animator).getClip(animation).reset()
          })
          await movePlayerTo(
            {
              x: otherTeleporterPosition.x,
              y: otherTeleporterPosition.y + 1,
              z: otherTeleporterPosition.z,
            },
            { x: 0, y: otherTeleporterPosition.y + 1, z: 0 }
          )
          otherTeleporter.animations.forEach((animation) => {
            otherTeleporter.getComponent(Animator).getClip(animation).play()
          })
        },
        onCameraExit: () => {
          log('onCameraExit')
          this.exited = true
        },
      })
    )
    this.placeholder.addComponentOrReplace(
      new ScaleTransformComponent(
        this.placeholder.getComponent(Transform).scale,
        new Vector3(0.35, 0.001, 0.35),
        1
      )
    )
    const myTexture = new Texture(
      `${config.ipfsEndpoint}${userPiece.metadata?.image.split('ipfs://')[1]}`
    )
    const myMaterial = new Material()
    myMaterial.albedoTexture = myTexture
    this.placeholder.addComponentOrReplace(myMaterial)

    this.addComponentOrReplace(
      new OnPointerDown(
        async (e) => {
          this.placeholder.addComponentOrReplace(
            new ScaleTransformComponent(
              this.placeholder.getComponent(Transform).scale,
              new Vector3(0, 0, 0),
              0.7
            )
          )
          this.placeholder.addComponentOrReplace(
            new Delay(5200, () => {
              this.placeholder.addComponentOrReplace(
                new ScaleTransformComponent(
                  this.placeholder.getComponent(Transform).scale,
                  new Vector3(0.35, 0.001, 0.35),
                  1
                )
              )
            })
          )
          this.animations.forEach((animation) => {
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
