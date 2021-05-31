import Config from './config'
import ContractOperation from './contractOperation'
import { Dispenser } from './entities/Dispenser'
import { Minter } from './entities/Minter'
import { Piece } from './entities/Piece'
import { Generate, mintParams } from './generate'
import { AvantGardeToken, getPieceByAddress, getPieces } from './graphql'
import { House } from './entities/House'

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
    // await this.initPieces()
    await this.contractOperation.init()
    await this.initUserPiece()
    await this.initPoap()
    const house = new House(new Vector3(8, 0, 8) )

  }

  async initPieces() {
    this.pieces = await getPieces()
    this.piecesEntities = this.pieces.map(
      (piece, i) => new Piece(new Vector3(i * 2, 2, 5), piece)
    )
  }

  async initUserPiece() {
    if (!this.contractOperation.address) {
      log('address not found', this.contractOperation.address)
      return false
    }
    this.userPiece = await getPieceByAddress(this.contractOperation.address)
    log('userPiece', this.userPiece)

    if (this.userPiece) {
      new Piece(new Vector3(10, 2, 2), this.userPiece)
    } else {
      let isMinting = false
      const minter = new Minter(new Vector3(8, 3, 9))
      minter.addComponentOrReplace(
        new OnPointerDown(
          async (e) => {
            try {
              if (isMinting || !this.contractOperation.address) {
                return false
              }
              log('clicked')
              isMinting = true
              if (!this.mintParams) {
                minter.getComponent(OnPointerDown).hoverText =
                  'Generating art...'
                this.mintParams = await Generate(this.contractOperation.address)
                minter.addPiece(this.mintParams)
              }
              minter.getComponent(OnPointerDown).hoverText = 'Minting art...'
              await this.contractOperation.mint(this.mintParams)
              log('Minted')
              this.userPiece = await getPieceByAddress(
                this.contractOperation.address
              )
              minter.removeComponent(OnPointerDown)
            } catch (error) {
              isMinting = false
              minter.getComponent(OnPointerDown).hoverText = 'Mint your!'
              log('failed to mint', error)
            }
          },
          {
            button: ActionButton.POINTER,
            hoverText: `Mint your!`,
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
