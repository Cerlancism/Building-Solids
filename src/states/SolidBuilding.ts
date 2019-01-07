import { GameAssetKeys } from "/assets"
import { BuildingGrid } from "../componenets/BuildingGrid";
import { GridBlock } from "/componenets/GridBlock";
import { GridBase } from "/componenets/GridBase";

export class SolidBuilding extends Phaser.State
{
    grid: BuildingGrid;
    block: GridBlock;

    init()
    {
        console.log("Main State", this.key)
    }

    create()
    {
        this.grid = new BuildingGrid(9, 13).setPosition(50, 125)
    }

    update()
    {

    }

    render()
    {

    }
}
