import { VectorIso3 } from "./VectorIso3";
import { IGridBlock } from "./IGridBlock";
import { IGridObject } from "./IGridObject";

export interface IGridBase extends IGridObject
{
    block: IGridBlock;

    ensurePointerHover(): VectorIso3
    ensurePointerClick(): VectorIso3
}