import { NPC, Dialog } from '@dcl/npc-scene-utils'

export let ILoveCats: Dialog[] = [
  {
    text: `I really lo-ove cats`,
    isEndOfDialog: true
  }
]

export class Robot {
  npc: NPC

  constructor(transform: Transform) {

    // this.addComponent(transform)
    this.npc = new NPC(transform, 'models/robot.glb', () => {
      this.npc.talk(ILoveCats, 0)
    })
  }
}
