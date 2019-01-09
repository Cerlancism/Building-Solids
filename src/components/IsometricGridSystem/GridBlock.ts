import { GameObject } from "/components/GameObject";
import { IGridBlock } from "./core/IGridBlock";
import { IGridContext } from "./core/IGridContext";

export class GridBlock extends GameObject implements IGridBlock
{
    private blockDraw: Phaser.Sprite

    constructor(
        gridContext: IGridContext,
        public readonly gridPosition
    )
    {
        super()
        this.blockDraw = this.create(0, 0, gridContext.blockTexture)
        this.blockDraw.anchor.set(0.5)
    }
}