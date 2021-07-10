interface NftDetails {
  ethereum: string
  image?: string
  audio?: string
  video?: string
}
export class PieceNft extends Entity {
  constructor(nftDetails: NftDetails, transform: Transform) {
    super()
    this.addComponent(new PlaneShape())
    this.addComponent(transform)
    engine.addEntity(this)

    if(nftDetails.image){
      const materialImage = new Material()
      materialImage.albedoTexture = new Texture(nftDetails.image)
      this.addComponent(materialImage)
      if(nftDetails.audio){
        const soundsEntity = new Entity()

        // const source = new AudioStream(nftDetails.audio)
        const clip = new AudioClip(nftDetails.audio)
        const source = new AudioSource(clip)

        source.volume = 0.1
        soundsEntity.addComponent(source)
        soundsEntity.setParent(this)
        this.addComponent(
          new OnPointerDown(() => {
            if(source.playing){

            }
            source.playing = !source.playing
            this.getComponent(OnPointerDown).hoverText = source.playing ? 'Stop': 'Play'
            },{
              button: ActionButton.POINTER,
              hoverText: source.playing ? 'Stop': 'Play',
              distance: 3,
            }
          )
        )
        engine.addEntity(soundsEntity)

      }

    } else if(nftDetails.video){
      const videoTexture = new VideoTexture(new VideoClip(nftDetails.video))
      videoTexture.playing = true
      videoTexture.loop = true
      videoTexture.volume = 0.5
      const materialVideo = new BasicMaterial()
      materialVideo.texture = videoTexture
      this.addComponent(materialVideo)
      this.addComponent(
        new OnPointerDown(() => {
            videoTexture.playing = !videoTexture.playing
            videoTexture.loop = true
            this.getComponent(OnPointerDown).hoverText = videoTexture.playing ? 'Pause': 'Play'
          },{
            button: ActionButton.POINTER,
            hoverText: videoTexture.playing ? 'Pause': 'Play',
            distance: 3,
          }
        )
      )
    }


    const openDialog = new Entity()
    openDialog.setParent(this)
    openDialog.addComponent(new PlaneShape())
    openDialog.addComponent(new Transform({
      position: new Vector3(0, -0.6, 0),
      scale: new Vector3(1, 0.2 , 1)
    }) )
    openDialog.addComponent(
      new OnPointerDown((e) => {
        openNFTDialog(nftDetails.ethereum)
      }, {
        button: ActionButton.POINTER,
        hoverText: 'Open',
        distance: 3,
      })
    )
    engine.addEntity(openDialog)
  }
}
