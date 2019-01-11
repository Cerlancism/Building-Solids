import { IGridContext, IGridCell } from "../core";

import { GridCell } from "./GridCell";

export class GridContext implements IGridContext
{
    public readonly onGridHover = new Phaser.Signal()
    public readonly onGridClick = new Phaser.Signal()

    public readonly baseTexturePolygon: Phaser.Polygon
    public readonly baseTexture: Phaser.RenderTexture
    public readonly dotTexture: Phaser.RenderTexture
    public readonly blockTexture: Phaser.RenderTexture

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

        this.dotTexture = new Phaser.Graphics(game)
            .beginFill(0x000000, 1)
            .drawCircle(0, 0, dotDiameter)
            .endFill()
            .generateTexture()

        this.blockTexture = new Phaser.Graphics(game)
            .lineStyle(1, 0x000000)
            .beginFill(0x93CDF9)
            .drawPolygon(new Phaser.Point(), this.gridCell.topLeft, this.gridCell.topCenter, this.gridCell.topRight)
            .beginFill(0x79A8CC)
            .drawPolygon(new Phaser.Point(), this.gridCell.topLeft, this.gridCell.bottonLeft, this.gridCell.bottomCenter)
            .beginFill(0x4D6A7F)
            .drawPolygon(new Phaser.Point(), this.gridCell.topRight, this.gridCell.bottonRight, this.gridCell.bottomCenter)
            .endFill()
            .generateTexture()
    }
}