import ContractOperation from './contractOperation'
import { Minter } from './entities/Minter'
import { Piece } from './entities/Piece'
import { Generate, mintParams } from './generate'
import { AvantGardeToken, getPieceByAddress, getPieces } from './graphql'

export class Gallery implements ISystem {
  contractOperation: ContractOperation
  pieces: AvantGardeToken[] = []
  piecesEntities: Piece[] = []
  userPiece: AvantGardeToken | null = null
  userPieceEntity: Piece | null = null
  mintParams?: mintParams

  constructor() {
    this.init().catch((error) => log('error init gallery', error))
    this.contractOperation = new ContractOperation()
  }

  async init() {
    this.pieces = await getPieces()
    this.piecesEntities = this.pieces.map(
      (piece, i) => new Piece(new Vector3(i * 2, 2, 5), piece)
    )
    await this.contractOperation.init()

    if (!this.contractOperation.address) {
      log('address not found', this.contractOperation.address)
      return false
    }
    log('address', this.contractOperation.address)
    this.userPiece = await getPieceByAddress(this.contractOperation.address)
    log('userPiece', this.userPiece)

    if (this.userPiece) {
      new Piece(new Vector3(10, 2, 2), this.userPiece)
    } else {
      let isMinting = false
      const minter = new Minter(new Vector3(10, 2, 2))
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

  update(dt: number): void {
    if (!this.userPiece && this.contractOperation.mintPrices) {
      // update mint price
    }
  }
}
