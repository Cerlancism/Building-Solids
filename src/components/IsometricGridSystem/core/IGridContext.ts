import { IGridCell } from "./IGridCell";

export interface IGridContext
{
    readonly gridCell: IGridCell
    readonly baseTexturePolygon: Phaser.Polygon
    readonly baseTexture: Phaser.RenderTexture
    readonly dotTexuture: Phaser.RenderTexture

    readonly onGridHover: Phaser.Signal
    readonly onGridClick: Phaser.Signal
}