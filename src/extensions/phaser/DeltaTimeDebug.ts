export class DeltaTimeDebug
{
    private deltaTimeLog: number[] = [];
    private tween: Phaser.Tween;
    private timeEvent: Phaser.TimerEvent;

    constructor(x: number = 10, y: number = 10, private readonly game?)
    {
        const [defaultGame] = Phaser.GAMES.reverse()
        game = game || defaultGame
        this.tween = game.add.tween(game.add
            .sprite(x, x, new Phaser.Graphics(game)
                .beginFill(0x000000)
                .drawRect(20, 20, 20, 20)
                .generateTexture()))
            .to({ x: game.world.width - x }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true)
            .onUpdateCallback(() => this.deltaTimeLog.push(game.time.elapsed))

        this.tween.target.anchor.set(0.5)

        this.timeEvent = game.time.events.repeat(1000 / 3, Infinity, () =>
        {
            const avg = Functors.average(this.deltaTimeLog)
            const subAvg = this.deltaTimeLog.slice(5).map((x, i) => (x + this.deltaTimeLog.slice(i, i + 5).reduce((u, v) => u + v)) / 5)
            const parition = subAvg.slice(1).map((x, i) => Math.abs(x - subAvg[i]))
            const fps = 1000 / avg
            const jitter = Functors.average(parition)
            const text = `Delta time: ${avg.toFixed(2)} ms (${fps.toFixed(0)} fps)\t\tJitter: ${jitter.toFixed(2)} ms \t\tBuffer size: ${this.deltaTimeLog.length}`
            game.debug.text(text, x, y, fps > 55 && jitter < 1 ? "#00ff00" : fps > 45 && jitter < 2 ? "#ffff00" : "#ff0000");
            this.deltaTimeLog = this.deltaTimeLog.length > 120 ? this.deltaTimeLog.slice(this.deltaTimeLog.length / 2, this.deltaTimeLog.length) : this.deltaTimeLog
        })
    }

    get sprite()
    {
        return this.tween.target as Phaser.Sprite
    }

    destroy()
    {
        this.sprite.destroy()
        this.timeEvent.timer.destroy()
        this.game.debug.text("", 0, 0)
    }
}