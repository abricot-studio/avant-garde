import { NPC, Dialog } from '@dcl/npc-scene-utils'

export const dialogsWelcome: Dialog[] = [
  {
    text: `Welcome to the AvantGarde experience fellow AvantGardist!`,
  },
  {
    text: `I am Albert, your guide through our new art experience.`,
  },
  {
    text: `Here, you will be able to generate your unique piece of art thanks to our Generator, in the center of the room.`,
  },
  {
    text: `If you want to learn more about the project, you can consult the billboards in the gallery that explain everything about AvantGarde.`,
  },
  {
    text: `You can claim your POAP by clicking on the POAP dispenser on your left.`,
  },
  {
    text: `A VIP room with exclusive content is available to AvantGardists.`
  },
  {
    text: `Mint your AvantGarde artwork to activate the teleporter to enter the VIP showroom.`,
    isEndOfDialog: true
  },
]

export const dialogsVip: Dialog[] = [
  {
    text: `Thanks for being part of this adventure with us and welcome to the AvantGarde VIP showroom!`,
  },
  {
    text: `As a VIP member you have some privileges such as 3 invitations for the avantGarde Generator, a DCL jumper wearable airdrop, and participating in auctions.`,
  },
  {
    text: `At AvantGarde we value our (VIP) members. Our intention is to provide you with the best experience possible.`,
  },
  {
    text: `Let me show you what you can do here.`,
  },
  {
    text: `Go to https://avant-garde.gallery to get your invitation code:
you will find 3 codes to invite your friends  and spread the message over!`,
  },
  {
    text: `Here, you can enjoy our favourite artists’ pieces made for this AvantGarde launch.`,
  },
  {
    text: `Take this opportunity to have these lovely pieces in your collection by participating in the auctions!`,
  },
  {
    text: `We bet that we can build awesome creations, by connecting different kinds of talent.`,
  },
  {
    text: `This is just the starting point. If holding AvantGarde is a state of mind, it means independent artists are valuable.`,
  },
  {
    text: `Thanks for your support, and thanks for helping us do what we like to do: artistic expression and experiment.`,
  },
  {
    text: `Love you all`,
    isEndOfDialog: true
  }
]

export class Robot {
  npc: NPC

  constructor(transform: Transform, dialogs: Dialog[]) {

    this.npc = new NPC(transform, 'models/robot.glb', () => {
      this.npc.playAnimation(`talkingAction`, true)
      this.npc.talkBubble(dialogs.map(dialog => {
        if(!dialog.triggeredByNext){
          dialog.triggeredByNext = () => this.npc.changeIdleAnim(`idleAction`, true)
        }
        return dialog
      }), 0)
    }, {
      faceUser: true,
      bubbleHeight: 5,
      idleAnim: 'idleAction',
      onWalkAway: () => {
        this.npc.changeIdleAnim(`idleAction`, true)
      }
    })
    this.npc.changeIdleAnim(`idleAction`, true)
  }
}
