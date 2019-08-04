export class Boot extends Phaser.State
{
    public static onCreate = new Phaser.Signal()

    init()
    {
        debugLog(this.key, "State Init")
        this.input.maxPointers = 1
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        // this.scale.setMinMax(320, 240, 1280, 960)
        this.scale.maxHeight = window.innerHeight;
        this.scale.maxWidth = window.innerHeight / 3 * 4
        // Disable generic right click menu.
        this.game.canvas.addEventListener('contextmenu', (event) => event.preventDefault())
        this.game.stage.disableVisibilityChange = true

        window.addEventListener("resize", () =>
        {
            this.scale.maxHeight = window.innerHeight;
            this.scale.maxWidth = window.innerHeight / 3 * 4
        })
    }

    create()
    {
        Boot.onCreate.dispatch()
    }
}
