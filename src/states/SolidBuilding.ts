import { GameAssetKeys } from "/assets"
import { BuildingGrid } from "../components/IsometricGridSystem/BuildingGrid";
import { GridContext } from "../components/IsometricGridSystem/entities/GridContext";
import { VectorIso3 } from "/components/IsometricGridSystem/entities/VectorIso3";

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
        this.grid = new BuildingGrid(new GridContext(30), 13, 15).setPosition(this.world.centerX * 2 - 100, 50)

        this.grid.addBlock(this.grid.gridCenter)
    }

    update()
    {

    }

    render()
    {

    }
}
