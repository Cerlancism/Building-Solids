import { VectorIso3 } from "../entities/VectorIso3";
import { IGridBase } from "./IGridBase";
import { IGridCell } from "./IGridCell";
import { GameObject } from "/components/GameObject";
import { IGridBlock } from "./IGridBlock";

export interface IBuildingGrid extends GameObject
{
    readonly extensionsFlat: IGridBase[]
    readonly blocks: IGridBlock[]
    readonly gridCell: IGridCell
    readonly gridDots: Phaser.Group

    readonly gridCenter: VectorIso3

    addBlock(position: VectorIso3): this
    getBase(position: VectorIso3): IGridBase
}