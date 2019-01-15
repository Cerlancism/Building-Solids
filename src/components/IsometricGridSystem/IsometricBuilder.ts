import { GameObject } from "/extensions/phaser";
import { BuildingGrid } from "./BuildingGrid";
import { GridContext } from "./entities";

export class IsometricBuilder extends GameObject
{
    public readonly grid: BuildingGrid

    private gridContext: GridContext
    private frame: Phaser.Sprite;

    constructor()
    {
        super()

        const spreadX = 9
        const spreadY = 13

        this.gridContext = new GridContext(30)
        this.grid = new BuildingGrid(this.gridContext, spreadX, spreadY)
            .withParent(this)
            .cascade(x => x.setPosition(this.gridContext.gridCell.fullWidth * (spreadX - 1) + this.gridContext.gridCell.fullWidth / 4, this.gridContext.gridCell.sideLength / 2))

        const frameWidth = this.gridContext.gridCell.fullWidth * (spreadX - 1) + this.gridContext.gridCell.fullWidth / 2
        const frameHeight = this.gridContext.gridCell.sideLength * spreadY

        const frameTexture = new Phaser.Graphics(this.game)
            .lineStyle(2, 0x000000, 1)
            .drawRect(0, 0, frameWidth, frameHeight + 4)
            .generateTexture()

        const inputBlockerTextureWidth = new Phaser.Graphics(this.game)
            .beginFill(0xFFFFFF, 0)
            .drawRect(0, 2, frameWidth + this.gridContext.gridCell.fullWidth, this.gridContext.gridCell.sideLength * 2)
            .generateTexture(1, Phaser.scaleModes.DEFAULT, 2)

        const inputBlockerTextureHeight = new Phaser.Graphics(this.game)
            .beginFill(0xFFFFFF, 0)
            .drawRect(0, 2, this.gridContext.gridCell.fullWidth * 2, frameHeight)
            .generateTexture(1, Phaser.scaleModes.DEFAULT)

        this.frame = this.create(0, -2, frameTexture) as Phaser.Sprite

        const inputBlocks: Phaser.Sprite[] = [
            this.create(-this.gridContext.gridCell.fullWidth, 0, inputBlockerTextureHeight),
            this.create(frameWidth - inputBlockerTextureHeight.width + this.gridContext.gridCell.fullWidth + 10, 0, inputBlockerTextureHeight),
            this.create(0, 0, inputBlockerTextureWidth),
            this.create(-10, frameHeight - inputBlockerTextureWidth.height + this.gridContext.gridCell.sideLength, inputBlockerTextureWidth)
        ]
        inputBlocks.forEach(x => x.inputEnabled = true)
    }
}