import { VectorIso3 } from "../entities/VectorIso3";

export interface IGridObject
{
    readonly gridPosition: VectorIso3
    readonly screenPosition: Phaser.Point
}