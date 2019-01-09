import { IGridCell } from "./IGridCell";

export interface IGridContext
{
    readonly gridCell: IGridCell
    readonly baseTexturePolygon: Phaser.Polygon
    readonly baseTexture: Phaser.RenderTexture
    readonly dotTexture: Phaser.RenderTexture
    readonly blockTexture: Phaser.RenderTexture

    readonly onGridHover: Phaser.Signal
    readonly onGridClick: Phaser.Signal
}