import { VectorIso3 } from "./VectorIso3";

export interface IGridObject
{
    readonly gridPosition: VectorIso3
    readonly screenPosition: Phaser.Point

    setInputActive(active: boolean): this;
}