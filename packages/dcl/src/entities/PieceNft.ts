interface NftDetails {
  ethereum: string
  image?: string
  audio?: string
  video?: string
  gif?: boolean
}
export class PieceNft extends Entity {
  placeholder: Entity

  constructor(nftDetails: NftDetails, transform: Transform) {
    super()
    const model = new GLTFShape('models/cadreVIP.glb')
    this.addComponent(model)
    this.addComponent(transform)
    engine.addEntity(this)

    this.placeholder = new Entity()
    this.placeholder.setParent(this)
    this.placeholder.addComponent(
      new Transform({
        scale: new Vector3(4, 4, 0.001),
        rotation: Quaternion.Euler(180, 0, 0),
        position: new Vector3(0, 0, 0.2),
      })
    )

    this.placeholder.addComponent(new PlaneShape())
    engine.addEntity(this.placeholder)

    if (nftDetails.image) {
      const materialImage = new Material()
      materialImage.albedoTexture = new Texture(nftDetails.image)
      this.placeholder.addComponent(materialImage)
      if (nftDetails.audio) {
        const soundsEntity = new Entity()

        // const source = new AudioStream(nftDetails.audio)
        const clip = new AudioClip(nftDetails.audio)
        const source = new AudioSource(clip)

        source.volume = 0.2
        soundsEntity.addComponent(source)
        soundsEntity.setParent(this)
        this.placeholder.addComponent(
          new OnPointerDown(
            () => {
              if (source.playing) {
              }
              source.playing = !source.playing
              this.placeholder.getComponent(OnPointerDown).hoverText =
                source.playing ? 'Stop' : 'Play'
            },
            {
              button: ActionButton.POINTER,
              hoverText: source.playing ? 'Stop' : 'Play',
              distance: 8,
            }
          )
        )
        engine.addEntity(soundsEntity)
      }
    } else if (nftDetails.video) {
      const videoTexture = new VideoTexture(new VideoClip(nftDetails.video))
      videoTexture.playing = true
      videoTexture.loop = true
      videoTexture.volume = 0.5
      const materialVideo = new BasicMaterial()
      materialVideo.texture = videoTexture
      this.placeholder.addComponent(materialVideo)
      this.placeholder.addComponent(
        new OnPointerDown(
          () => {
            videoTexture.playing = !videoTexture.playing
            videoTexture.loop = true
            this.placeholder.getComponent(OnPointerDown).hoverText =
              videoTexture.playing ? 'Pause' : 'Play'
          },
          {
            button: ActionButton.POINTER,
            hoverText: videoTexture.playing ? 'Pause' : 'Play',
            distance: 8,
          }
        )
      )
    } else if (nftDetails.gif) {
      const gifEntity = new Entity()
      gifEntity.addComponent(
        new Transform({
          position: new Vector3(0, 0, -0.2),
          scale: new Vector3(2, 2, 0.1),
          // rotation: Quaternion.Euler(0, 180, 0),
        })
      )
      const shapeComponent = new NFTShape(nftDetails.ethereum, {
        color: Color3.White(),
        style: PictureFrameStyle.None,
      })
      gifEntity.addComponent(shapeComponent)
      gifEntity.setParent(this.placeholder)
      engine.addEntity(gifEntity)
    }

    const openDialog = new Entity()
    openDialog.setParent(this)
    openDialog.addComponent(new GLTFShape('models/openAuctionBtn.glb'))
    openDialog.addComponent(
      new Transform({
        position: new Vector3(0, -3.5, 0.5),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    openDialog.addComponent(
      new OnPointerDown(
        (e) => {
          openNFTDialog(nftDetails.ethereum)
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Open',
          distance: 8,
        }
      )
    )
    engine.addEntity(openDialog)
  }
}
