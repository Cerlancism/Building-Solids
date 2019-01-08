import { GridCell } from "./GridCell";

export class GridConfig
{
    baseTexture: Phaser.RenderTexture
    gridCell: GridCell

    constructor(
        public readonly sideLength: number,
        game = GameInstance)
    {
        this.gridCell = new GridCell(sideLength)

        this.baseTexture = new Phaser.Graphics(game).lineStyle(1, 0x000000)
            .beginFill(0xDDDDDD, 1)
            .drawPolygon({ x: 0, y: 0 }, this.gridCell.bottonLeft, this.gridCell.bottomCenter, this.gridCell.bottonRight)
            .endFill()
            .generateTexture()
    }
}