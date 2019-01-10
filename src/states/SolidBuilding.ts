import { GameAssetKeys } from "/assets"
import { BuildingGrid } from "../components/IsometricGridSystem/BuildingGrid";
import { GridContext } from "../components/IsometricGridSystem/entities/GridContext";
import { VectorIso3 } from "/components/IsometricGridSystem/entities/VectorIso3";

export class SolidBuilding extends Phaser.State
{
    public static key = "SolidBuilding"

    grid: BuildingGrid;

    deltaTimeLog: number[] = []
    deltaTimeText: string = ""

    init()
    {
        debugLog(this.key, "State Init")
    }

    create()
    {
        this.grid = new BuildingGrid(new GridContext(40), 10, 13).setPosition(this.world.centerX * 2 - 100, 50)

        this.add.tween(this.add
            .sprite(10, 10, new Phaser.Graphics(this.game)
                .beginFill(0x000000)
                .drawRect(20, 20, 20, 20)
                .generateTexture()))
            .to({ x: this.world.width - 90 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true)

        this.time.events.repeat(333, Infinity, () =>
        {
            this.deltaTimeLog = this.deltaTimeLog.length > 333 ? this.deltaTimeLog.slice(this.deltaTimeLog.length / 2, this.deltaTimeLog.length) : this.deltaTimeLog
            this.deltaTimeText = (this.deltaTimeLog.reduce((x, y) => x + y) / this.deltaTimeLog.length).toString() + ` ms  log length: ${this.deltaTimeLog.length}`
            this.game.debug.text('Delta Time: ' + this.deltaTimeText, 10, 10, "#00ff00");
        })
    }

    update()
    {
        this.deltaTimeLog.push(this.game.time.elapsed)
    }

    render()
    {

    }
}
