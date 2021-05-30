import { AvantGardeToken, getPieceByAddress, getPieces } from './graphql'
import { Piece } from './entities/Piece'
import ContractOperation from './contractOperation'

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

    log('address', this.contractOperation.address)
    this.userPiece = await getPieceByAddress(this.contractOperation.address)
    log('userPiece', this.userPiece)

    if(this.userPiece){

      new Piece(new Vector3(10, 2, 2), this.userPiece)

    } else {

      //user can mint

    }

  }

  update(dt: number): void {

  }
}
