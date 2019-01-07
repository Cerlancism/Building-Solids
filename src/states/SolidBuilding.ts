import { GameAssetKeys } from "/assets"
import { BuildingGrid } from "../componenets/BuildingGrid";
import { GridBlock } from "/componenets/GridBlock";

export class SolidBuilding extends Phaser.State
{
    grid: BuildingGrid;
    init()
    {
        console.log("Main State", this.key)
    }

    create()
    {
        this.grid = new BuildingGrid(9, 13).setPosition(50, 125)

        this.grid.addBlock(this.grid.gridCenter)
    }

    update()
    {

    }

    render()
    {

    }
}
