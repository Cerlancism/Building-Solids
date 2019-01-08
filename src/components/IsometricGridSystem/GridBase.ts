import { GameObject } from "/components/GameObject";
import { GridBlock } from "./GridBlock";
import { VectorIso3 } from "./entities/VectorIso3";
import { IGridContext } from "./core/IGridContext";
import { IGridBase } from "./core/IGridBase";

const DEFAULT = 0.15

export class GridBase extends GameObject implements IGridBase
{
    public block: GridBlock;
    public gridPosition: VectorIso3

    private graphics: Phaser.Sprite;

    constructor(
        private readonly gridContext: IGridContext)
    {
        super()

        this.graphics = this.create(0, 0, gridContext.baseTexture)
        this.graphics.anchor.set(0.5, 0)

        this.graphics.hitArea = gridContext.baseTexturePolygon

        this.graphics.inputEnabled = true
        this.graphics.events.onInputOver.add((x: Phaser.Graphics) => this.handleInputOver(x))
        this.graphics.events.onInputOut.add((x: Phaser.Graphics) => this.handleInputOut(x))
        this.graphics.events.onInputUp.add((x: Phaser.Graphics, pointer: Phaser.Pointer, over: boolean) => this.handleInputUp(x, pointer, over))


        this.graphics.alpha = DEFAULT
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

    public ensurePointerHover()
    {
        if (this.graphics.alpha == 1)
        {
            return
        }
        if (this.graphics.input.checkPointerOver(this.game.input.activePointer, true))
        {

            this.graphics.alpha = 0.5
        }
        else
        {
            this.graphics.alpha = DEFAULT
        }
    }

    public ensurePointerClick()
    {
        if (!this.graphics.input.checkPointerOver(this.game.input.activePointer, true))
        {
            return
        }
        this.graphics.alpha = this.graphics.alpha == 1 ? 0.5 : 1
    }
}