import { UIKeys, GameAssetValues, GameAssetKeys } from "/assets"
import { SolidBuilding } from "./SolidBuilding"

export class Preloader extends Phaser.State
{
    preloadBar: Phaser.Sprite
    preloadText: Phaser.Text

    init()
    {
        console.log("State", this.key)
        console.log("KeyValues", GameAssetValues, "Keys", GameAssetKeys)
    }

    preload()
    {
        this.preloadText = this.add.text(this.camera.bounds.centerX, this.camera.height - 100, "Loading.", { fontSize: 16, font: "Courier", wordWrap: true, wordWrapWidth: 600 })
        this.preloadText.anchor.set(0.5, 0.5)

        this.preloadBar = this.add.sprite(100, this.camera.bounds.centerY, UIKeys.preloader_bar)
        this.preloadBar.anchor.set(0, 0.5)
        this.load.setPreloadSprite(this.preloadBar)
    }

    loadUpdate()
    {
        this.preloadText.setText(`Loading: ${this.load.progressFloat.toPrecision(3)}%`)
    }

    create()
    {
        console.log("Load Complete")
        this.state.start(SolidBuilding.name)
    }
}