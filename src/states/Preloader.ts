export class Preloader extends Phaser.State
{
    public static key = "Preloader"
    public static onCreate = new Phaser.Signal()

    preloadBar: Phaser.Sprite
    preloadText: Phaser.Text

    init()
    {
        debugLog(this.key, "State Init")
    }

    preload()
    {
        this.preloadText = this.add.text(this.camera.bounds.centerX, this.camera.height - 100, "Loading.", { fontSize: 16, font: "Courier", wordWrap: true, wordWrapWidth: 600 })
        this.preloadText.anchor.set(0.5, 0.5)

        this.preloadBar = this.add.sprite(100, this.camera.bounds.centerY, new Phaser.Graphics(this.game).beginFill(0xFFF).drawRoundedRect(0, 0, 600, 100, 9).generateTexture())
        this.preloadBar.anchor.set(0, 0.5)
        this.load.setPreloadSprite(this.preloadBar)
    }

    loadUpdate()
    {
        this.preloadText.setText(`Loading: ${this.load.progressFloat.toPrecision(3)}%`)
    }

    create()
    {
        infoLog("Load Complete")

        Preloader.onCreate.dispatch()
    }
}