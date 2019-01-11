import { VectorIso3 } from "./VectorIso3";
import { IGridBlock } from "./IGridBlock";
import { IGridObject } from "./IGridObject";

export interface IGridBase extends IGridObject
{
    setInputActive(active: boolean): void;
    ensurePointerHover(): VectorIso3
    ensurePointerClick(): VectorIso3
    attach(block: IGridBlock): void
    sortBlocks(parent: Phaser.Group): void
}