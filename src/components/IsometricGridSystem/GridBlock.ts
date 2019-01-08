import { GameObject } from "/components/GameObject";
import { GridSkeleton } from "./GridSkeleton";

export class GridBlock extends GameObject
{
    private blockDraw: GridSkeleton

    constructor(
        public readonly diameter = 5,
        public readonly sideLength = 30,
        public readonly lineWidth = 0,
    )
    {
        super()
        this.blockDraw = new GridSkeleton(diameter, sideLength, lineWidth).withParent(this)
    }
}