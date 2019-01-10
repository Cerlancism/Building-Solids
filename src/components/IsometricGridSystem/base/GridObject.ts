import { GameObject } from "../../../extensions/phaser/GameObject";
import { IGridObject } from "../core/IGridObject";
import { VectorIso3 } from "../entities/VectorIso3";
import { IGridContext } from "../core/IGridContext";

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
}