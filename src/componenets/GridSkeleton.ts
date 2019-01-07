import { GridCell } from "./GridCell";
import { GameObject } from "/common/GameObject";

export class GridSkeleton extends GameObject
{
    gridCell: GridCell
    graphic: Phaser.Graphics

    constructor(
        public readonly diameter,
        public readonly sideLength,
        public readonly lineWidth
    )
    {
        super()

        this.gridCell = new GridCell(sideLength)

        this.graphic = this.game.add.graphics(0, 0, this)
            .beginFill(0x000000, 1)
            .drawCircle(0, 0, diameter)
            .endFill()


        if (lineWidth > 0)
        {
            const { bottomCenter, bottonLeft, bottonRight, topCenter, topLeft, topRight } = this.gridCell
            this.graphic = this.graphic.lineStyle(lineWidth, 0x000000)
                .lineTo(bottomCenter.x, bottomCenter.y)
                .lineTo(bottonLeft.x, bottonLeft.y)
                .lineTo(topLeft.x, topLeft.y)
                .lineTo(0, 0)
                .lineTo(topRight.x, topRight.y)
                .lineTo(topCenter.x, topCenter.y)
                .lineTo(topLeft.x, topLeft.y)
                .moveTo(topRight.x, topRight.y)
                .lineTo(bottonRight.x, bottonRight.y)
                .lineTo(bottomCenter.x, bottomCenter.y)
        }
    }
}