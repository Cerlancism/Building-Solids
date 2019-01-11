import { GameObject } from "/extensions/phaser/";
import { IGridContext, IGridBase } from "./core";

export class GridDots extends GameObject
{
    constructor(gridContext: IGridContext, bases: IGridBase[])
    {
        super()

        const diameter = gridContext.dotDiameter
        const graphic = new Phaser.Graphics(this.game).beginFill(0x000000)

        bases.forEach(x => graphic.drawCircle(x.screenPosition.x, x.screenPosition.y, diameter))

        const texture = graphic.generateTexture(1, Phaser.scaleModes.DEFAULT, diameter)

        this.game.add.sprite(diameter * 1.5, -diameter / 2, texture, 0, this).anchor.set(1, 0)
    }
}