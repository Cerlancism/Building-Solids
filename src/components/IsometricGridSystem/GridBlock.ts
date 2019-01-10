import { IGridContext } from "./core/IGridContext";
import { VectorIso3 } from "./entities/VectorIso3";
import { GridObject } from "./base/GridObject";
import { IGridBlock } from "./core/IGridBlock";

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