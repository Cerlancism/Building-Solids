import { GameObject } from "/common/GameObject";
import { GridBlock } from "./GridBlock";
import { VectorIso3 } from "./entities/VectorIso3";
import { GridConfig } from "./entities/GridConfig";

export class GridBase extends GameObject
{
    graphics: Phaser.Sprite;
    block: GridBlock;

    gridPosition: VectorIso3

    constructor(
        gridConfig: GridConfig)
    {
        super()

        this.graphics = this.create(0, 0, gridConfig.baseTexture)

        this.graphics.inputEnabled = true;
        this.graphics.events.onInputUp.add(() => (this.graphics.alpha = this.graphics.alpha == 0 ? 1 : 0) && debugLog(`Position ${this.gridPosition}`))

        // this.dot = this.game.add.graphics(0, 0, this)
        //     .beginFill(0x000000, 1)
        //     .drawCircle(0, 0, diameter)
        //     .endFill()
    }
}