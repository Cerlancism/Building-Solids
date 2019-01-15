import { IGridBlock, IGridContext, VectorIso3 } from "./core";
import { GridObject } from "./base";

export class GridBlock extends GridObject implements IGridBlock
{
    private attached: IGridBlock
    private blockDraw: Phaser.Sprite
    private inputSprite: Phaser.Sprite

    private hoverBinding: Phaser.SignalBinding

    constructor(
        gridContext: IGridContext,
        gridPosition: VectorIso3
    )
    {
        super(gridContext, gridPosition)
        this.blockDraw = this.create(0, 0, gridContext.blockTexture)
        this.blockDraw.anchor.set(0.5)

        const inputSprite = this.inputSprite = this.create(0, (-this.blockDraw.height / 4), gridContext.baseTexture) as Phaser.Sprite
        inputSprite.hitArea = gridContext.baseTexturePolygon
        inputSprite.alpha = 0
        inputSprite.anchor.set(0.5, 0)

        this.hoverBinding = inputSprite.events.onInputOver.add(() => this.gridContext.onGridHover.dispatch(this))
    }

    setTint(tint: number)
    {
        this.blockDraw.tint = tint
    }

    get allowBuild()
    {
        return this.blockDraw.tint !== Phaser.Color.RED
    }

    get screenPosition()
    {
        return this.position
    }

    setInputActive(active: boolean): void
    {
        this.inputSprite.inputEnabled = true
        this.inputSprite.input.useHandCursor = active

        if (!active)
        {
            this.hoverBinding.detach()
        }
    }

    attach(attachable: IGridBlock): void
    {
        this.attached = attachable
    }

    sortBlocks(parent: Phaser.Group): void
    {
        parent.bringToTop(this)
        if (this.attached)
        {
            this.attached.sortBlocks(parent)
        }
    }
}