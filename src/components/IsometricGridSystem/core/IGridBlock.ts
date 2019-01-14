import { IGridObject } from "./IGridObject";
import { IAttachableTop } from "./IAttachableTop";

export interface IGridBlock extends IGridObject, IAttachableTop<IGridBlock>
{
    readonly allowBuild: boolean
    destroy()
}