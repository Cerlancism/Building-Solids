import { GameAssetKeys } from "/assets"
import { BuildingGrid } from "../componenets/BuildingGrid";

export class SolidBuilding extends Phaser.State
{
    grid: BuildingGrid;

    init()
    {
        console.log("Main State", this.key)
    }

    create()
    {
        this.grid = new BuildingGrid(3, 2).setPosition(this.world.centerX, this.world.centerY)
    }

    update()
    {

    }

    render()
    {

    }
}
