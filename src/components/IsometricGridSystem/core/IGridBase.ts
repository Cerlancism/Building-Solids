import { VectorIso3 } from "./VectorIso3";
import { IGridBlock } from "./IGridBlock";
import { IGridObject } from "./IGridObject";
import { IAttachableTop } from "./IAttachableTop";

export interface IGridBase extends IGridObject, IAttachableTop<IGridBlock>
{

}