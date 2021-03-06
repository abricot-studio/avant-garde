import * as UI from '@dcl/ui-scene-utils'
import Config from './config'
import ContractOperation from './contractOperation'
import { Dispenser } from './entities/Dispenser'
import { House } from './entities/House'
import { Minter } from './entities/Minter'
import { MusicBox } from './entities/musicBox'
import { Piece } from './entities/Piece'
import { PieceNft } from './entities/PieceNft'
import { dialogsVip, dialogsWelcome, Robot } from './entities/Robot'
import { Teleporter } from './entities/teleporter'
import { Generate, mintParams } from './generate'
import { AvantGardeToken, Graphql } from './graphql'
import { formatEther, setInterval } from './utils'

export class Gallery implements ISystem {
  contractOperation: ContractOperation
  sceneMessageBus: MessageBus
  piecesEntities: Piece[] = []
  userPiece: AvantGardeToken | null = null
  userPieceEntity: Piece | null = null
  mintParams?: mintParams
  POAPBooth?: Dispenser
  teleporterDown?: Teleporter
  teleporterStairs?: Teleporter
  minter?: Minter
  isPreview: boolean = false
  graphql: Graphql

  constructor() {
    this.contractOperation = new ContractOperation()
    this.sceneMessageBus = new MessageBus()
    this.graphql = new Graphql()
    this.init().catch((error) => log('error init gallery', error))
  }

  async init() {
    // this.isPreview = await isPreview()
    //
    // if (this.isPreview) {
    new House()
    this.initRobots()
    await this.contractOperation.init()
    await Promise.all([
      this.graphql.init(),
      this.initUserPiece(),
      // this.initPoap(),
    ])
    await this.initMinterTeleporter()
    this.initMusic()
    this.initPieceNfts()
    // } else {
    //   new BeforeLaunchHouse()
    // }
  }

  initRobots() {
    const robotWelcome = new Robot(
      new Transform({
        position: new Vector3(12, 0.5, -4),
        rotation: Quaternion.Euler(0, 0, 0),
      }),
      dialogsWelcome
    )
    dialogsWelcome[1].triggeredByNext = () =>
      robotWelcome.npc.playAnimation(`pointingAction`, true)
    new Robot(
      new Transform({
        position: new Vector3(-6, 20.1, -5),
        rotation: Quaternion.Euler(0, 0, 0),
      }),
      dialogsVip
    )
  }

  async initPieces() {
    // this.pieces = await this.graphql.getPieces()
    // this.piecesEntities = this.pieces
    //   .slice(0, Piece.Transformations.length)
    //   .map((piece, i) => new Piece(Piece.Transformations[i], piece))
  }

  async initUserPiece() {
    if (!this.contractOperation.address) {
      log('address not found', this.contractOperation.address)
      return false
    }
    this.userPiece = await this.graphql.getPieceByAddress(
      this.contractOperation.address
    )
    log('userPiece', this.userPiece)
    this.minter = new Minter(this.userPiece)

    if (!this.userPiece) {
      let isMinting = false
      this.minter.placeholder.addComponentOrReplace(
        new OnPointerDown(
          async (e) => {
            try {
              if (isMinting || !this.contractOperation.address) {
                return false
              }
              log('isMinting')
              isMinting = true
              if (this.minter) {
                if (!this.mintParams) {
                  this.minter.loading()
                  this.minter.placeholder.getComponent(
                    OnPointerDown
                  ).hoverText = 'Generating art...'
                  const mintParams = await Generate(
                    this.contractOperation.address
                  )
                  log('mintParams', mintParams)

                  if (mintParams.status !== 'success') {
                    throw new Error(mintParams.message || 'unknown error')
                  }
                  this.mintParams = mintParams
                  this.minter.addPiece(this.mintParams)
                  this.minter.placeholder.getComponent(
                    OnPointerDown
                  ).hoverText = 'Mint your!'
                  isMinting = false
                  return true
                }
                this.minter.placeholder.getComponent(OnPointerDown).hoverText =
                  'Minting art...'
                const txHash = await this.contractOperation.mint(
                  this.mintParams
                )
                const receipt = await this.contractOperation.waitForTx(txHash)
                log('Minted', receipt)
                const interval = setInterval(() => {
                  log('setTimeout Minted', this.userPiece)

                  if (
                    this.contractOperation &&
                    this.contractOperation.address
                  ) {
                    log('setTimeout contractOperation', this.contractOperation)
                    this.graphql
                      .getPieceByAddress(this.contractOperation.address)
                      .then((userPiece) => {
                        this.userPiece = userPiece
                        log('userPiece', this.userPiece)
                        log('minter', this.minter)
                        if (this.userPiece && this.minter) {
                          this.minter.userPiece = this.userPiece
                          this.minter.minted()
                          if (this.teleporterDown && this.teleporterStairs) {
                            this.teleporterDown.addUserPiece(this.userPiece)
                            this.teleporterStairs.addUserPiece(this.userPiece)
                          }
                          isMinting = false
                          interval.clearInterval()
                        }
                      })
                      .catch()
                  }
                }, 5000)
              }
            } catch (error: any) {
              isMinting = false
              UI.displayAnnouncement(
                `Oops, there was an error:\n${error.message}`,
                3
              )
              if (this.minter && this.minter.placeholder) {
                this.minter.placeholder.getComponent(OnPointerDown).hoverText =
                  'Generate your!'
              }
              log('failed to mint', error)
            }
          },
          {
            button: ActionButton.POINTER,
            hoverText: `Generate your!`,
            distance: 6,
          }
        )
      )
    } else if (this.teleporterDown && this.teleporterStairs) {
      this.teleporterDown.addUserPiece(this.userPiece)
      this.teleporterStairs.addUserPiece(this.userPiece)
    }
  }

  async initPoap() {
    this.POAPBooth = new Dispenser(
      {
        position: new Vector3(14, 0.3, -14),
        rotation: Quaternion.Euler(0, 0, 0),
      },
      Config.poapSeverUrl,
      Config.poapEventId,
      this.sceneMessageBus
    )

    this.sceneMessageBus.on('activatePoap', () => {
      this.POAPBooth?.activate()
    })
  }

  async initMinterTeleporter() {
    this.teleporterDown = new Teleporter(
      new Transform({
        position: new Vector3(-10.8, 0.7, -10.8),
        rotation: Quaternion.Euler(0, 70, 0),
      }),
      'Go to AvantGardists lounge!'
    )
    this.teleporterStairs = new Teleporter(
      new Transform({
        position: new Vector3(-10.8, 20, -10.8),
        rotation: Quaternion.Euler(0, 50, 0),
      }),
      'Go to AvantGarde generator!'
    )
    this.teleporterDown.activate(this.teleporterStairs)
    this.teleporterStairs.activate(this.teleporterDown)

    if (this.userPiece) {
      this.teleporterDown.addUserPiece(this.userPiece)
      this.teleporterStairs.addUserPiece(this.userPiece)
    }
  }

  initPieceNfts() {
    //https://api.opensea.io/api/v1/asset/
    const graffirap = new PieceNft(
      {
        ethereum:
          'ethereum://0x495f947276749ce646f68ac8c248420045cb7b5e/31579987235644736708101780315467862908536911764207097187188861645553634639873',
        image:
          'https://lh3.googleusercontent.com/vunZSSkLoJIPwSIoef_-8PsfHB-ZiIsG-QPn0s_xc4406JmdnG4hwvVJN38CTUB8EQsEuDKAfJhfdxRyg8Oa_jWK8YNVMPuq-IpP',
        audio: 'audio/graffirap.wav', // 'https://storage.opensea.io/files/ed09d4b2fc372cca67013f2753c3241d.wav'
      },
      new Transform({
        position: new Vector3(-9, 25, 9),
        rotation: Quaternion.Euler(0, -226, 0),
      })
    )
    const wallace = new PieceNft(
      {
        ethereum:
          'ethereum://0x60f80121c31a0d46b5279700f9df786054aa5ee5/1129178',
        gif: true,
      },
      new Transform({
        position: new Vector3(0, 25, 13),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    const oce = new PieceNft(
      {
        ethereum: 'ethereum://0xc02697c417ddacfbe5edbf23edad956bc883f4fb/17499',
        image:
          'https://lh3.googleusercontent.com/GSfTcft_rAX56l5msySs25FSXiFXBDxVn6bghcJ6in2C9tyuEy2IJeB9oqYOW6F_EOLPG46fEVNtHL-0ptnfaIIyULljlzIqml4T',
      },
      new Transform({
        position: new Vector3(9, 25, 9),
        rotation: Quaternion.Euler(0, -135, 0),
      })
    )
    const ruben = new PieceNft(
      {
        ethereum:
          'ethereum://0x495f947276749ce646f68ac8c248420045cb7b5e/7557340173844726611425323825186638187486998272719620299255139822281198403585',
        video:
          'https://storage.opensea.io/files/26f5dece4f96c76ef38c0e29121aa918.mp4',
      },
      new Transform({
        position: new Vector3(13, 25, 0),
        rotation: Quaternion.Euler(0, -90, 0),
      })
    )
    const radioBato = new PieceNft(
      {
        ethereum:
          'ethereum://0x495f947276749ce646f68ac8c248420045cb7b5e/2165514460155157643134678580987885961104769492778982270620613138639795257345',
        image:
          'https://lh3.googleusercontent.com/Po2USNvQ5fRqNb_ygWY2pRiVE4aE-jqiIsFsG04Oc3uCw_2h6taMDHk31vez9nMMA6tWS6itsMbTmrJPw6mjI8YhSWH4A9UGdDGG',
        // audio: 'https://storage.opensea.io/files/f8da05aee650b8f972878a38fd1dc6f7.mp3'
        audio: 'audio/radiobato.mp3', //https://storage.opensea.io/files/f8da05aee650b8f972878a38fd1dc6f7.mp3'
      },
      new Transform({
        position: new Vector3(9, 25, -9),
        rotation: Quaternion.Euler(0, -45, 0),
      })
    )
  }

  initMusic() {
    new MusicBox(Config.streamUrl, Config.soundcloudUrl)
  }

  update(dt: number): void {
    if (
      !this.userPiece &&
      this.minter &&
      this.minter.priceText &&
      this.minter.priceTextPlatform &&
      this.contractOperation.mintPrices
    ) {
      this.minter.priceText.value = formatEther(
        this.contractOperation.mintPrices.currentPrice
      ).toString()
      this.minter.priceTextPlatform.value = formatEther(
        this.contractOperation.mintPrices.fees
      ).toString()
    }

    if (this.graphql.pieces.length > 0) {
      this.graphql.pieces
        .slice(0, Piece.Transformations.length * 2)
        .forEach((piece, i) => {
          const iFloor = Math.floor(i / 2)
          if (!this.piecesEntities[iFloor]) {
            log('new piece add', i, piece)
            this.piecesEntities.push(
              new Piece(Piece.Transformations[iFloor], piece)
            )
          } else if (
            iFloor === i / 2 &&
            this.piecesEntities[iFloor].avantGardeToken1.id !== piece.id
          ) {
            log('piece1 updated', i, piece)
            this.piecesEntities[iFloor].avantGardeToken1 = piece
            this.piecesEntities[iFloor].refreshPlaceholder1()
          } else if (
            Math.round(i / 2) !== i / 2 &&
            this.piecesEntities[iFloor].avantGardeToken2?.id !== piece.id
          ) {
            log('piece2 updated', i, piece)
            this.piecesEntities[iFloor].avantGardeToken2 = piece
            this.piecesEntities[iFloor].refreshPlaceholder2()
          }
        })
    }
  }
}
