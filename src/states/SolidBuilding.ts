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
        this.grid = new BuildingGrid(new GridContext(30), 5, 5).setPosition(this.world.centerX, this.world.centerY)

        this.grid.addBlock(new VectorIso3(0, 0))
    }

    update()
    {

    }

    render()
    {

    }
}
