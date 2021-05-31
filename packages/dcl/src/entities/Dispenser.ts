import { Delay } from '@dcl/ecs-scene-utils'
import * as UI from '@dcl/ui-scene-utils'
import { getCurrentRealm } from '@decentraland/EnvironmentAPI'
import { getUserData } from '@decentraland/Identity'

export class Dispenser extends Entity {
  idleAnim = new AnimationState('Idle_POAP', { looping: true })
  buyAnim = new AnimationState('Action_POAP', { looping: false })
  buttonAnim = new AnimationState('Button_Action', { looping: false })
  eventName: string
  clickable: boolean = true
  timeToClickable: number = 0
  sceneMessageBus: MessageBus

  constructor(
    transform: TranformConstructorArgs,
    poapServer: string,
    eventName: string,
    sceneMessageBus: MessageBus
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new GLTFShape('models/poap/POAP_dispenser.glb'))
    this.addComponent(new Transform(transform))

    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(this.idleAnim)
    this.getComponent(Animator).addClip(this.buyAnim)
    this.idleAnim.play()

    this.eventName = eventName
    this.sceneMessageBus = sceneMessageBus

    let button = new Entity()
    button.addComponent(new GLTFShape('models/poap/POAP_button.glb'))
    button.addComponent(new Animator())
    button.getComponent(Animator).addClip(this.buttonAnim)
    button.setParent(this)
    button.addComponent(
      new OnPointerDown(
        (e) => {
          if (!this.clickable) return
          this.clickable = false

          button.getComponent(Animator).getClip('Action').stop()
          button.getComponent(Animator).getClip('Action').play()
          //sceneMessageBus.emit('activatePoap', {})
          this.makeTransaction(poapServer, eventName)
        },
        { hoverText: 'Get Attendance Token' }
      )
    )
    engine.addEntity(button)
  }

  public activate(): void {
    let anim = this.getComponent(Animator)

    anim.getClip('Idle_POAP').stop()
    anim.getClip('Action_POAP').stop()

    anim.getClip('Action_POAP').play()

    this.addComponentOrReplace(
      new Delay(4000, () => {
        anim.getClip('Action_POAP').stop()

        anim.getClip('Idle_POAP').play()
      })
    )
  }

  async makeTransaction(poapServer: string, event: string) {
    const userData = await getUserData()
    if (!userData || !userData.hasConnectedWeb3) {
      log('no wallet')
      return
    }
    const realm = await getCurrentRealm()
    if (!realm) {
      log('no realm')
      return
    }
    const url = `https://${poapServer}/claim/${event}`
    let method = 'POST'
    let headers = { 'Content-Type': 'application/json' }
    let body = JSON.stringify({
      address: userData.publicKey,
      catalyst: realm.domain,
      room: realm.layer,
    })

    try {
      let response = await fetch(url, {
        headers: headers,
        method: method,
        body: body,
      })
      let data = await response.json()
      this.clickable = true
      if (response.status == 200) {
        UI.displayAnnouncement('The POAP was sent to your address', 3)
        this.sceneMessageBus.emit('activatePoap', {})
      } else {
        UI.displayAnnouncement(`Oops, there was an error: "${data.error}"`, 3)
      }
    } catch {
      this.clickable = true
      log('error fetching from POAP server ', url)
    }

    return
  }
}
