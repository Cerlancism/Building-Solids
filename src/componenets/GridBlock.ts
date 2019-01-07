import { GameObject } from "/common/GameObject";
import { GridSkeleton } from "./GridSkeleton";

export class GridBlock extends GameObject
{
    gridCells: GridSkeleton[]
    fullWidth: number;
    fullHeight: number;

    constructor(
        public readonly diameter = 5,
        public readonly sideLength = 30,
        public readonly lineWidth = 0,
    )
    {
        super()
        this.gridCells = Enumberable.repeat(0, 7).map(x => new GridSkeleton(diameter, sideLength, lineWidth))
        this.gridCells.forEach(x => this.addChild(x))

        const firstCell = this.gridCells[0]
        const { topLeft, topRight, bottomCenter } = firstCell

        this.fullWidth = topRight.x - topLeft.x
        this.fullHeight = sideLength * 2

        this.gridCells[1].setPosition(bottomCenter.x, bottomCenter.y)
        this.gridCells[2].setPosition(topLeft.x, topLeft.y)
        this.gridCells[3].setPosition(topRight.x, topRight.y)
        this.gridCells[4].setPosition(topRight.x, topRight.y + sideLength)
        this.gridCells[5].setPosition(topLeft.x, topRight.y + sideLength)
        this.gridCells[6].setPosition(0, -sideLength)
    }
}