import { GameObject } from "/components/GameObject";
import { VectorIso3 } from "../entities/VectorIso3";

export interface IGridBlock extends GameObject
{
    gridPosition: VectorIso3
}