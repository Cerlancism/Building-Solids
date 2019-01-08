import { GridCell } from "./GridCell";
import { IGridContext } from "../core/IGridContext";

export class GridContext implements IGridContext
{
    public readonly onGridHover = new Phaser.Signal()
    public readonly onGridClick = new Phaser.Signal()

    public readonly gridCell: GridCell
    public readonly baseTexturePolygon: Phaser.Polygon
    public readonly baseTexture: Phaser.RenderTexture
    public readonly dotTexuture: Phaser.RenderTexture

    constructor(
        public readonly sideLength: number,
        diameter = 5,
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
            .drawCircle(0, 0, diameter)
            .endFill()
            .generateTexture()
    }
}