import Config from './config'
import ContractOperation from './contractOperation'
import { Dispenser } from './entities/Dispenser'
import { House } from './entities/House'
import { Minter } from './entities/Minter'
import { Piece } from './entities/Piece'
import { Podium } from './entities/podium'
import { Generate, mintParams } from './generate'
import { AvantGardeToken, getPieceByAddress, getPieces } from './graphql'

export class Gallery implements ISystem {
  contractOperation: ContractOperation
  sceneMessageBus: MessageBus
  pieces: AvantGardeToken[] = []
  piecesEntities: Piece[] = []
  userPiece: AvantGardeToken | null = null
  userPieceEntity: Piece | null = null
  mintParams?: mintParams
  POAPBooth?: Dispenser

  constructor() {
    this.contractOperation = new ContractOperation()
    this.sceneMessageBus = new MessageBus()
    this.init().catch((error) => log('error init gallery', error))
  }

  async init() {
    new House()
    new Podium()
    await this.initPieces()
    await this.contractOperation.init()
    await this.initUserPiece()
    await this.initPoap()
  }

  async initPieces() {
    this.pieces = await getPieces()
    this.piecesEntities = this.pieces
      .slice(0, Piece.Transformations.length)
      .map((piece, i) => new Piece(Piece.Transformations[i], piece))
  }

  async initUserPiece() {
    if (!this.contractOperation.address) {
      log('address not found', this.contractOperation.address)
      return false
    }
    this.userPiece = await getPieceByAddress(this.contractOperation.address)
    log('userPiece', this.userPiece)

    if (this.userPiece) {
      new Piece(
        new Transform({
          position: new Vector3(8, 3, 8),
        }),
        this.userPiece
      )
    } else {
      let isMinting = false
      const minter = new Minter()
      minter.placeholder.addComponentOrReplace(
        new OnPointerDown(
          async (e) => {
            try {
              if (isMinting || !this.contractOperation.address) {
                return false
              }
              log('clicked')
              isMinting = true
              if (!this.mintParams) {
                minter.loading()
                minter.placeholder.getComponent(OnPointerDown).hoverText =
                  'Generating art...'
                this.mintParams = await Generate(this.contractOperation.address)
                minter.addPiece(this.mintParams)
                minter.placeholder.getComponent(OnPointerDown).hoverText =
                  'Mint your!'
                isMinting = false
                return true
              }
              minter.placeholder.getComponent(OnPointerDown).hoverText =
                'Minting art...'
              await this.contractOperation.mint(this.mintParams)
              log('Minted')
              this.userPiece = await getPieceByAddress(
                this.contractOperation.address
              )
              minter.placeholder.removeComponent(OnPointerDown)
            } catch (error) {
              isMinting = false
              minter.placeholder.getComponent(OnPointerDown).hoverText =
                'Generate your!'
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
        position: new Vector3(14, 0, 14),
        rotation: Quaternion.Euler(0, -90, 0),
      },
      Config.poapSeverUrl,
      Config.poapEventId,
      this.sceneMessageBus
    )

    this.sceneMessageBus.on('activatePoap', () => {
      this.POAPBooth?.activate()
    })
  }

  update(dt: number): void {
    if (!this.userPiece && this.contractOperation.mintPrices) {
      // update mint price
    }
  }
}
