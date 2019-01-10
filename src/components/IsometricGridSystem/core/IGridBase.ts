import { GameObject } from "../../../extensions/phaser/GameObject";
import { VectorIso3 } from "../entities/VectorIso3";
import { IGridBlock } from "./IGridBlock";
import { IGridObject } from "./IGridObject";

export interface IGridBase extends IGridObject
{
    block: IGridBlock;

    ensurePointerHover(): VectorIso3
    ensurePointerClick(): VectorIso3
}