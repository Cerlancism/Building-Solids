import { GameObject } from "/extensions/phaser";
import { BuildingGrid } from "./BuildingGrid";
import { GridContext } from "./entities";
import { GridBlock } from "./GridBlock";
import { VectorIso3 } from "./core";

export class IsometricBuilder extends GameObject
{
    public readonly grid: BuildingGrid

    private gridContext: GridContext
    private frame: Phaser.Sprite;
    subFrame: Phaser.Sprite;

    dragBlock: GridBlock

    private updateCallBack: Function = () => { }

    constructor()
    {
        super()

        const spreadX = 8
        const spreadY = 11

        this.gridContext = new GridContext(35)
        this.grid = new BuildingGrid(this.gridContext, spreadX, spreadY)
            .withParent(this)
            .cascade(x => x.setPosition(this.gridContext.gridCell.fullWidth * (spreadX - 1) + this.gridContext.gridCell.fullWidth / 4, this.gridContext.gridCell.sideLength / 2))

        const frameWidth = this.gridContext.gridCell.fullWidth * (spreadX - 1) + this.gridContext.gridCell.fullWidth / 2
        const frameHeight = this.gridContext.gridCell.sideLength * spreadY

        const frameTexture = new Phaser.Graphics(this.game)
            .lineStyle(2, 0x000000, 1)
            .drawRect(0, 0, frameWidth, frameHeight + 4)
            .generateTexture()

        const subFrameTexture = new Phaser.Graphics(this.game)
            .lineStyle(2, 0x000000, 1)
            .drawRect(0, 0, this.gridContext.gridCell.fullWidth * 2.5, this.gridContext.gridCell.sideLength * 2.75)
            .generateTexture()

        const inputBlockerTextureWidth = new Phaser.Graphics(this.game)
            .beginFill(0xFFFFFF, 0)
            .drawRect(0, 2, frameWidth + this.gridContext.gridCell.fullWidth, this.gridContext.gridCell.sideLength * 2)
            .generateTexture(1, Phaser.scaleModes.DEFAULT, 2)

        const inputBlockerTextureHeight = new Phaser.Graphics(this.game)
            .beginFill(0xFFFFFF, 0)
            .drawRect(0, 2, this.gridContext.gridCell.fullWidth * 2, frameHeight)
            .generateTexture(1, Phaser.scaleModes.DEFAULT)

        const arrowTexture = new Phaser.Graphics(this.game)
            .lineStyle(2, 0x000000, 1)
            .beginFill(0x000000, 1)
            .drawPolygon([new Phaser.Point(0, -2), new Phaser.Point(-2, 2), new Phaser.Point(2, 2), new Phaser.Point(0, -2)])
            .moveTo(0, 2)
            .lineTo(0, this.gridContext.gridCell.sideLength - 4)
            .drawPolygon([new Phaser.Point(0, this.gridContext.gridCell.sideLength - 2), new Phaser.Point(-2, this.gridContext.gridCell.sideLength - 6), new Phaser.Point(2, this.gridContext.gridCell.sideLength - 6), new Phaser.Point(0, this.gridContext.gridCell.sideLength - 2)])
            .generateTexture()

        const subFrameInputBlock = this.create(0, -2, subFrameTexture)
        subFrameInputBlock.hitArea = new Phaser.Rectangle(subFrameTexture.frame.x, subFrameTexture.frame.y, subFrameTexture.frame.width, subFrameTexture.frame.height).scale(1.25, 2)

        const inputBlocks: Phaser.Sprite[] = [
            this.create(-this.gridContext.gridCell.fullWidth, 0, inputBlockerTextureHeight),
            this.create(frameWidth - inputBlockerTextureHeight.width + this.gridContext.gridCell.fullWidth + 10, 0, inputBlockerTextureHeight),
            this.create(0, 0, inputBlockerTextureWidth),
            this.create(-10, frameHeight - inputBlockerTextureWidth.height + this.gridContext.gridCell.sideLength, inputBlockerTextureWidth),
            subFrameInputBlock
        ]
        inputBlocks.forEach(x => x.inputEnabled = true)

        this.frame = this.create(0, -2, frameTexture) as Phaser.Sprite
        this.frame.inputEnabled = true

        this.subFrame = this.create(0, -2, subFrameTexture) as Phaser.Sprite
        this.subFrame.inputEnabled = true
        this.subFrame.input.useHandCursor = true

        this.subFrame.events.onInputDown.add(() => this.handleDrag())
        this.grid.onEnableChanged.add((active: boolean) => this.frame.inputEnabled = !active)

        const instructionBlock = new GridBlock(this.gridContext, new VectorIso3)
            .withParent(this)
            .setPosition(this.gridContext.gridCell.fullWidth * 1.25, this.gridContext.gridCell.sideLength * 1.5)
            .cascade(x => x.create(this.gridContext.gridCell.fullWidth / 2 + 5, this.gridContext.gridCell.topRight.y, arrowTexture))
            .cascade(x =>
            {
                const arrow = x.create(-5, -this.gridContext.gridCell.sideLength - 10, arrowTexture) as Phaser.Sprite;
                arrow.angle = 60
            })
            .cascade(x =>
            {
                const arrow = x.create(0, -this.gridContext.gridCell.sideLength - 5, arrowTexture) as Phaser.Sprite;
                arrow.angle = -60
            })
    }

    private handleDrag()
    {
        this.grid.setEnabled(true)
        this.dragBlock = new GridBlock(this.gridContext, new VectorIso3())
            .cascade(x => x.alpha = 0.5)

        this.updateCallBack = () =>
        {
            this.dragBlock.setPosition(this.game.input.x, this.game.input.y - this.gridContext.gridCell.sideLength / 2)
        }

        const hoverExecuter = this.grid.onGridHover.addOnce(() =>
        {
            this.dragBlock.destroy()
            this.updateCallBack = () => { }
        })

        this.game.input.onUp.addOnce(() =>
        {
            if (this.dragBlock.alive)
            {
                hoverExecuter.execute()
                this.grid.setEnabled(false)
            }
        })
    }

    update()
    {
        super.update()
        this.updateCallBack()
    }
}