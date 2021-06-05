import Config from './config'
import ContractOperation from './contractOperation'
import { Dispenser } from './entities/Dispenser'
import { House } from './entities/House'
import { Minter } from './entities/Minter'
import { Piece } from './entities/Piece'
import { Teleporter } from './entities/teleporter'
import { Generate, mintParams } from './generate'
import { AvantGardeToken, Graphql } from './graphql'
import { formatEther, isPreview } from './utils'
import * as UI from '@dcl/ui-scene-utils'

export class Gallery implements ISystem {
  contractOperation: ContractOperation
  sceneMessageBus: MessageBus
  piecesEntities: Piece[] = []
  userPiece: AvantGardeToken | null = null
  userPieceEntity: Piece | null = null
  mintParams?: mintParams
  POAPBooth?: Dispenser
  teleporter?: Teleporter
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
    new House()
    // new Podium()
    // await this.contractOperation.init()
    // this.isPreview = await isPreview()

    if (this.isPreview && false) {
      await Promise.all([
        this.graphql.init(),
        this.initUserPiece(),
        this.initPoap(),
      ])
      await this.initMinterTeleporter()
    }
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

    if (this.userPiece) {
      const mintedPiece = new Piece(
        new Transform({
          position: new Vector3(16, 3, 0),
        }),
        this.userPiece
      )
      mintedPiece.addComponent(new Billboard(false, true, false))
    } else {
      let isMinting = false
      this.minter = new Minter()
      this.minter.placeholder.addComponentOrReplace(
        new OnPointerDown(
          async (e) => {
            try {
              if (isMinting || !this.contractOperation.address) {
                return false
              }
              log('clicked')
              isMinting = true
              if (this.minter) {
                if (!this.mintParams) {
                  this.minter.loading()
                  this.minter.placeholder.getComponent(
                    OnPointerDown
                  ).hoverText = 'Generating art...'
                  this.mintParams = await Generate(
                    this.contractOperation.address
                  )
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
                this.userPiece = await this.graphql.getPieceByAddress(
                  this.contractOperation.address
                )
                log('userPiece', this.userPiece)
                this.minter.priceText1.value = ''
                this.minter.priceText2.value = ''
                this.minter.placeholder.addComponentOrReplace(
                  new OnPointerDown(
                    () => {
                      openExternalURL(`${this.userPiece?.metadata?.external_url}`)
                    },
                    {
                      button: ActionButton.POINTER,
                      hoverText: `Open details`,
                      distance: 4,
                    }
                  )
                )
                this.teleporter?.activate()
                isMinting = false
              }
            } catch (error) {
              isMinting = false
              UI.displayAnnouncement(`Oops, there was an error: "${error}"`, 3)
              if (this.minter) {
                this.minter.placeholder.getComponent(OnPointerDown).hoverText =
                  'Generate your!'
              }
              log('failed to mint', error)
            }
          },
          {
            button: ActionButton.POINTER,
            hoverText: `Generate your!`,
            distance: 10,
          }
        )
      )
    }
  }

  async initPoap() {
    this.POAPBooth = new Dispenser(
      {
        position: new Vector3(29, 0.3, -9),
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
    this.teleporter = new Teleporter()
    if (this.userPiece) {
      this.teleporter.activate()
    }
  }

  update(dt: number): void {
    if (!this.userPiece && this.contractOperation.mintPrices && this.minter) {
      this.minter.priceText2.value = `
      ${formatEther(this.contractOperation.mintPrices.currentPrice)} Ξ
      ${formatEther(this.contractOperation.mintPrices.fees)} Ξ
      `
    }

    if (this.graphql.pieces.length > 0) {
      this.graphql.pieces
        .slice(0, Piece.Transformations.length)
        .forEach((piece, i) => {
          if (!this.piecesEntities[i]) {
            log('new piece add', i, piece)
            this.piecesEntities.push(new Piece(Piece.Transformations[i], piece))
          } else if (this.piecesEntities[i].avantGardeToken.id !== piece.id) {
            log('piece updated', i, piece)
            this.piecesEntities[i].avantGardeToken = piece
            this.piecesEntities[i].refreshPlaceholder()
          }
        })
    }
  }
}
