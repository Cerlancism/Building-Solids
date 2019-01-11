import { IGridBlock, IGridContext, VectorIso3 } from "./core";
import { GridObject } from "./base";


export class GridBlock extends GridObject implements IGridBlock
{
    private blockDraw: Phaser.Sprite

    constructor(
        gridContext: IGridContext,
        gridPosition: VectorIso3
    )
    {
        super(gridContext, gridPosition)
        this.blockDraw = this.create(0, 0, gridContext.blockTexture)
        this.blockDraw.anchor.set(0.5)
    }

    get screenPosition()
    {
        return this.position
    }
}