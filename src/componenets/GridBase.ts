import { GameObject } from "/common/GameObject";
import { GridCell } from "./GridCell";
import { GridBlock } from "./GridBlock";

export class GridBase extends GameObject
{
    dot: Phaser.Graphics;
    graphics: Phaser.Graphics;
    gridCell: GridCell;
    block: GridBlock;
    constructor(
        public readonly diameter: number = 5,
        public readonly sideLength: number = 30)
    {
        super()
        this.gridCell = new GridCell(sideLength)

        this.graphics = this.game.add.graphics(0, 0, this)
            .lineStyle(1, 0x000000)
            .beginFill(0xDDDDDD, 1)
            .drawPolygon({ x: 0, y: 0 }, this.gridCell.bottonLeft, this.gridCell.bottomCenter, this.gridCell.bottonRight)
            .endFill()
        this.graphics.alpha = 0

        this.dot = this.game.add.graphics(0, 0, this)
            .beginFill(0x000000, 1)
            .drawCircle(0, 0, diameter)
            .endFill()
    }
}