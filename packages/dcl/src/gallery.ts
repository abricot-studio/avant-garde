import Config from './config'
import ContractOperation from './contractOperation'
import { Dispenser } from './entities/Dispenser'
import { House } from './entities/House'
import { Minter } from './entities/Minter'
import { Piece } from './entities/Piece'
import { Podium } from './entities/podium'
import { Generate, mintParams } from './generate'
import { AvantGardeToken, getPieceByAddress, getPieces } from './graphql'
import { Teleporter } from './entities/teleporter'
import { formatEther } from './utils'

export class Gallery implements ISystem {
  contractOperation: ContractOperation
  sceneMessageBus: MessageBus
  pieces: AvantGardeToken[] = []
  piecesEntities: Piece[] = []
  userPiece: AvantGardeToken | null = null
  userPieceEntity: Piece | null = null
  mintParams?: mintParams
  POAPBooth?: Dispenser
  teleporter?: Teleporter
  minter?: Minter

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
      const mintedPiece = new Piece(
        new Transform({
          position: new Vector3(8, 3, 8),
        }),
        this.userPiece
      )
      mintedPiece.addComponent(new Billboard(false, true, false) )
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
              if (this.minter){
                if(!this.mintParams) {
                  this.minter.loading()
                  this.minter.placeholder.getComponent(OnPointerDown).hoverText =
                    'Generating art...'
                  this.mintParams = await Generate(this.contractOperation.address)
                  this.minter.addPiece(this.mintParams)
                  this.minter.placeholder.getComponent(OnPointerDown).hoverText =
                    'Mint your!'
                  isMinting = false
                  return true
                }
                this.minter.placeholder.getComponent(OnPointerDown).hoverText =
                  'Minting art...'
                await this.contractOperation.mint(this.mintParams)
                log('Minted')
                this.userPiece = await getPieceByAddress(
                  this.contractOperation.address
                )
                this.minter.placeholder.removeComponent(OnPointerDown)
                this.teleporter?.activate()
                isMinting = false
              }
            } catch (error) {
              isMinting = false
              if(this.minter){
                this.minter.placeholder.getComponent(OnPointerDown).hoverText = 'Generate your!'
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

    await this.initMinterTeleporter()

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

  async initMinterTeleporter(){

    this.teleporter = new Teleporter()
    if(this.userPiece){

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
  }
}
