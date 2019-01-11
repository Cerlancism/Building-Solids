import { GameAssetKeys } from "/assets"
import { BuildingGrid } from "/components/IsometricGridSystem";
import { GridContext } from "/components/IsometricGridSystem/entities";
import { DeltaTimeDebug } from "/extensions/phaser/DeltaTimeDebug";

export class SolidBuilding extends Phaser.State
{
    public static key = "SolidBuilding"

    grid: BuildingGrid;

    init()
    {
        debugLog(this.key, "State Init")
    }

    create()
    {
        this.grid = new BuildingGrid(new GridContext(40), 10, 13).setPosition(this.world.centerX * 2 - 100, 50)

        const deltaTimer = new DeltaTimeDebug()
    }

    update()
    {

    }

    render()
    {

    }
}
