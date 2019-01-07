import { GameObject } from "/common/GameObject";
import { GridSkeleton } from "./GridSkeleton";

export class GridBlock extends GameObject
{
    blockDraw: GridSkeleton

    constructor(
        public readonly diameter = 5,
        public readonly sideLength = 30,
        public readonly lineWidth = 0,
    )
    {
        super()
        this.blockDraw = new GridSkeleton(diameter, sideLength, lineWidth)
            .cascade(x => this.add(x))
    }
}