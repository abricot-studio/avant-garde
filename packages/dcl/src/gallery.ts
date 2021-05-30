import { AvantGardeToken, getPieceByAddress, getPieces } from './graphql'
import { Piece } from './entities/Piece'
import ContractOperation from './contractOperation'
import { Minter } from './entities/Minter'

export class Gallery implements ISystem {

  contractOperation: ContractOperation
  pieces: AvantGardeToken[] = []
  piecesEntities: Piece[] = []
  userPiece: AvantGardeToken | null = null
  userPieceEntity: Piece | null = null

  constructor() {

    this.init().catch(error => log('error init gallery', error) )
    this.contractOperation = new ContractOperation()

  }

  async init(){

    this.pieces = await getPieces()
    this.piecesEntities = this.pieces.map( (piece, i) => new Piece(new Vector3(i * 2, 2, 5), piece) )
    await this.contractOperation.init()

    if(!this.contractOperation.address){
      log('address not found', this.contractOperation.address)
      return false
    }
    log('address', this.contractOperation.address)
    this.userPiece = await getPieceByAddress(this.contractOperation.address)
    log('userPiece', this.userPiece)

    if(this.userPiece){

      new Piece(new Vector3(10, 2, 2), this.userPiece)

    } else {

      //user can mint
      let isMinting = false
      const minter = new Minter(new Vector3(10, 2, 2) )
      minter.addComponentOrReplace(
        new OnPointerDown(e => {
            if(isMinting){
              return false
            }
            log('clicked')
            isMinting = true
            this.contractOperation.mint().then(() => {
              debugger
            }).catch(error => {
              isMinting = false
              log('failed to mint', error)
            })
          },
          {
            button: ActionButton.POINTER,
            hoverText: 'Mint your!',
            distance: 10
          }
        ) )
    }

  }

  update(dt: number): void {

  }
}
