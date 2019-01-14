import { IGridBase, IGridBlock, IGridContext, VectorIso3 } from "./core";
import { GridObject } from "./base";

const DEFAULT = 0.15

export class GridBase extends GridObject implements IGridBase
{
    private graphics: Phaser.Sprite
    private attached: IGridBlock

    constructor(
        gridContext: IGridContext,
        gridPosition: VectorIso3
    )
    {
        super(gridContext, gridPosition)

        this.graphics = this.create(0, 0, gridContext.baseTexture)
        this.graphics.anchor.set(0.5, 0)

        this.graphics.hitArea = gridContext.baseTexturePolygon

        this.setInputActive(true)
        this.graphics.events.onInputOver.add((x: Phaser.Graphics) => this.handleInputOver(x))
        this.graphics.alpha = DEFAULT
    }

    get screenPosition()
    {
        return this.position
    }

    private handleInputOut(x: Phaser.Graphics)
    {

    }

    private handleInputOver(x: Phaser.Graphics)
    {
        this.gridContext.onGridHover.dispatch(this);
    }

    public setInputActive(active: boolean)
    {
        this.graphics.inputEnabled = active
        this.graphics.input.useHandCursor = active
    }

    attach(block: IGridBlock): void
    {
        this.attached = block
    }

    sortBlocks(parent: Phaser.Group): void
    {
        if (this.attached)
        {
            this.attached.sortBlocks(parent)
        }
    }
}