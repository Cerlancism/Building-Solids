import { GameAssetKeys } from "/assets"
import { BuildingGrid } from "../components/IsometricGridSystem/BuildingGrid";
import { GridConfig } from "/components/IsometricGridSystem/entities/GridConfig";

export class SolidBuilding extends Phaser.State
{
    grid: BuildingGrid;
    init()
    {
        console.log("Main State", this.key)
    }

    create()
    {
        this.grid = new BuildingGrid(9, 13, new GridConfig(30)).setPosition(50, 125)
    }

    update()
    {

    }

    render()
    {

    }
}
