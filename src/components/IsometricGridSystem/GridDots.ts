import { GameObject } from "/components/GameObject";
import { IGridContext } from "./core/IGridContext";
import { IGridBase } from "./core/IGridBase";

export class GridDots extends GameObject
{
    constructor(gridContext: IGridContext, extensions: IGridBase[])
    {
        super()
        extensions.forEach(x => this.game.add.sprite(x.x, x.y, gridContext.dotTexuture, 0, this).anchor.set(0.5))
    }
}