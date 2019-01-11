import { IGridBase, IGridBlock, IGridContext, VectorIso3 } from "./core";
import { GridObject } from "./base";
import { Lazy } from "/common/Lazy";
import { GridBlock } from "./GridBlock";

const DEFAULT = 0.15

export class GridBase extends GridObject implements IGridBase
{

    private graphics: Phaser.Sprite
    private hintBlock: Lazy<GridBlock>
    private block: IGridBlock

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
        this.graphics.events.onInputOut.add((x: Phaser.Graphics) => this.handleInputOut(x))
        this.graphics.events.onInputUp.add((x: Phaser.Graphics, pointer: Phaser.Pointer, over: boolean) => this.handleInputUp(x, pointer, over))
        this.graphics.alpha = DEFAULT

        this.hintBlock = new Lazy<GridBlock>(() => new GridBlock(gridContext, new VectorIso3()).withParent(this))
    }

    get screenPosition()
    {
        return this.position
    }

    private handleInputUp(x: Phaser.Graphics, pointer: Phaser.Pointer, over: boolean)
    {
        if (pointer.isMouse && pointer.button != Phaser.Mouse.LEFT_BUTTON)
        {
            return
        }
        this.gridContext.onGridClick.dispatch()
    }

    private handleInputOut(x: Phaser.Graphics)
    {
        x.alpha != 1 && (x.alpha = DEFAULT);
    }

    private handleInputOver(x: Phaser.Graphics)
    {
        x.alpha != 1 && (x.alpha = 0.5);
        this.gridContext.onGridHover.dispatch();
    }

    public setInputActive(active: boolean)
    {
        this.graphics.inputEnabled = active
        this.graphics.input.useHandCursor = active
    }

    public ensurePointerHover()
    {
        if (this.graphics.alpha === 1)
        {
            (this.parent as Phaser.Group).sendToBack(this)
            return null
        }
        if (this.graphics.input.checkPointerOver(this.game.input.activePointer, true))
        {
            this.hintBlock.value.alpha = 0.5;
            this.graphics.alpha = 0.5
            return this.gridPosition
        }
        else
        {
            (this.parent as Phaser.Group).sendToBack(this)
            this.hintBlock.value.alpha = 0;
            this.graphics.alpha = DEFAULT
            return null
        }
    }

    public ensurePointerClick()
    {
        if (!this.graphics.input.checkPointerOver(this.game.input.activePointer, true))
        {
            return null
        }
        debugLog(`${this.gridPosition}`, "Clicked")
        this.graphics.alpha = this.graphics.alpha === 1 ? 0.5 : 1
        return this.gridPosition
    }

    attach(block: IGridBlock): void
    {
        this.block = block
    }

    sortBlocks(parent: Phaser.Group): void
    {
        this.hintBlock.hasValue && this.hintBlock.value.alpha != 0 && parent.bringToTop(this)
        this.block && parent.bringToTop(this.block)
    }
}