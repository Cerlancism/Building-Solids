import { IGridContext } from "../core/IGridContext";
import { GridCell } from "./GridCell";
import { IGridCell } from "../core/IGridCell";

export class GridContext implements IGridContext
{
    public readonly onGridHover = new Phaser.Signal()
    public readonly onGridClick = new Phaser.Signal()

    public readonly baseTexturePolygon: Phaser.Polygon
    public readonly baseTexture: Phaser.RenderTexture
    public readonly dotTexuture: Phaser.RenderTexture

    public readonly gridCell: IGridCell;

    constructor(
        sideLength: number,
        dotDiameter = 5,
        game = GameInstance)
    {
        this.gridCell = new GridCell(sideLength)
        this.baseTexturePolygon = new Phaser.Polygon(new Phaser.Point(), this.gridCell.bottonLeft, this.gridCell.bottomCenter, this.gridCell.bottonRight)

        this.baseTexture = new Phaser.Graphics(game)
            .lineStyle(1, 0x000000)
            .beginFill(0xAAAAAA, 1)
            .drawPolygon(this.baseTexturePolygon)
            .endFill()
            .generateTexture()

        this.dotTexuture = new Phaser.Graphics(game)
            .beginFill(0x000000, 1)
            .drawCircle(0, 0, dotDiameter)
            .endFill()
            .generateTexture()
    }
}