import { GameObject } from "/extensions/phaser/";
import { IGridObject, IGridContext, VectorIso3 } from "../core";

export abstract class GridObject extends GameObject implements IGridObject
{
    constructor(
        protected readonly gridContext: IGridContext,
        public readonly gridPosition: VectorIso3
    )
    {
        super()

        const { x, y } = gridPosition.to2D(gridContext.gridCell.sideLength)
        this.setPosition(x, y)
    }

    get screenPosition()
    {
        return this.position
    }

    setInputActive(active: boolean): void
    {
        throw new Error("Method not implemented.");
    }
}