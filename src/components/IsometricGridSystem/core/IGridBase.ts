import { GameObject } from "/components/GameObject";
import { VectorIso3 } from "../entities/VectorIso3";
import { IGridBlock } from "./IGridBlock";

export interface IGridBase extends GameObject
{
    block: IGridBlock;
    gridPosition: VectorIso3

    ensurePointerHover(): VectorIso3
    ensurePointerClick(): VectorIso3
}