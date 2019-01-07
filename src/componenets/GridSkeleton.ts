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

        if (lineWidth > 0)
        {
            this.graphic = this.graphic.lineStyle(lineWidth, 0x000000)
                .lineTo(0, sideLength)
                .moveTo(0, 0)
                .lineTo(-this.xTarget, -this.yTarget)
                .moveTo(0, 0)
                .lineTo(this.xTarget, -this.yTarget)
        }

    }

    get xTarget()
    {
        return this.gridCell.xTarget
    }

    get yTarget()
    {
        return this.gridCell.yTarget
    }

    get topLeft()
    {
        return this.gridCell.topLeft
    }

    get topRight()
    {
        return this.gridCell.topRight
    }

    get bottomCenter()
    {
        return this.gridCell.bottomCenter
    }
}