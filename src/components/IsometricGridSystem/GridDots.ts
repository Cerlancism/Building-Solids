import { GameObject } from "/extensions/phaser/";
import { IGridContext, IGridBase } from "./core";

export class GridDots extends GameObject
{
    constructor(gridContext: IGridContext, extensions: IGridBase[])
    {
        super()
        extensions.forEach(x => this.game.add.sprite(x.screenPosition.x, x.screenPosition.y, gridContext.dotTexture, 0, this).anchor.set(0.5))
    }
}