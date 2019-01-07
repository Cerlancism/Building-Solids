import { GameObject } from "/common/GameObject";
import { GridBlock } from "./GridBlock";
import { GridBase } from "./GridBase";

export class BuildingGrid extends GameObject
{
    origin: GridBase
    extensions: GridBase[][] = []
    constructor(spreadSizeX: number, spreadSizeY: number)
    {
        super()

        this.origin = new GridBase().cascade(x => this.add(x))
        const gridCell = this.origin.gridCell
        for (let x = 0; x < spreadSizeX; x++)
        {
            let row: GridBase[] = []
            for (let y = 0; y < spreadSizeY; y++)
            {
                row.push(new GridBase().setPosition(gridCell.fullWidth * x, gridCell.sideLength * y))
                y < (spreadSizeY - 1) && x < (spreadSizeX - 1) && row.push(new GridBase().setPosition(gridCell.bottonRight.x + gridCell.fullWidth * x, gridCell.bottonRight.y + gridCell.sideLength * y))
            }
            this.extensions.push(row)
            this.extensions.reverse().forEach(x => x.forEach(y => this.addChild(y)))
        }
    }
}