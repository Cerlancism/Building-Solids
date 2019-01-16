import { IGridBase, IGridBlock, IGridContext, VectorIso3 } from "./core";
import { GridObject } from "./base";
import { AsyncEvents } from "/extensions/phaser";

const DEFAULT_ALPHA = 0.15

export class GridBase extends GridObject implements IGridBase
{
    private graphics: Phaser.Sprite
    private attached: IGridBlock
    private _allowBuild = false
    private hardDisabled = false

    constructor(
        gridContext: IGridContext,
        gridPosition: VectorIso3
    )
    {
        super(gridContext, gridPosition)

        this.graphics = this.create(0, 0, gridContext.baseTexture)
        this.graphics.anchor.set(0.5, 0)

        this.graphics.hitArea = gridContext.baseTexturePolygon

        this.graphics.events.onInputOver.add((x: Phaser.Graphics) => this.handleInputOver(x))
        this.graphics.alpha = 0
    }

    get screenPosition()
    {
        return this.position
    }

    get allowBuild()
    {
        return this._allowBuild
    }

    private handleInputOver(x: Phaser.Graphics)
    {
        this.gridContext.onGridHover.dispatch(this);
    }

    public setInputActive(active: boolean)
    {
        return this.cascade(async x => 
        {
            if (x.hardDisabled)
            {
                return
            }
            await AsyncEvents.nextFrameAsync()
            x.graphics.inputEnabled = active
            x.graphics.input.useHandCursor = active
            return
        })
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

    setAllowBuild(allow: boolean): this
    {
        if (this.hardDisabled)
        {
            return
        }
        this._allowBuild = allow

        if (allow)
        {
            this.graphics.alpha = DEFAULT_ALPHA
        }
        else
        {
            this.graphics.alpha = 0
        }

        return this
    }

    hardDisable(): this
    {
        this.hardDisabled = true
        return this
    }
}