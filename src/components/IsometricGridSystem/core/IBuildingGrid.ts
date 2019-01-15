import { VectorIso3 } from "./VectorIso3";
import { IGridBase } from "./IGridBase";
import { IGridCell } from "./IGridCell";
import { IGridBlock } from "./IGridBlock";

export interface IBuildingGrid
{
    readonly gridBases: IGridBase[]
    readonly blocks: IGridBlock[]
    readonly gridCell: IGridCell
    readonly gridDots: Phaser.Group

    readonly gridCenter: VectorIso3
    readonly minMax: { minX: VectorIso3, minY: VectorIso3, maxX: VectorIso3, maxY: VectorIso3 }

    readonly onEnableChanged: Phaser.Signal
    readonly onGridHover: Phaser.Signal

    addBlock(position: VectorIso3): this
    getBase(position: VectorIso3): IGridBase
    setEnabled(active: boolean): this
}