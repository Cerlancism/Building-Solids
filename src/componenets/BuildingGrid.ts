import { GameObject } from "/common/GameObject";
import { GridBlock } from "./GridBlock";

export class BuildingGrid extends GameObject
{
    origin: GridBlock
    extensions: GridBlock[] = []
    constructor(spreadSizeX: number, spreadSizeY: number)
    {
        super()

        this.origin = new GridBlock()

        for (let x = 1; x <= spreadSizeX; x++)
        {
            for (let y = 0; y <= spreadSizeY; y++)
            {
                this.extensions.push(new GridBlock().setPosition(0, y * this.origin.fullHeight))
                this.extensions.push(new GridBlock().setPosition(0, -y * this.origin.fullHeight))
                this.extensions.push(new GridBlock().setPosition(this.origin.fullWidth * x, y * this.origin.fullHeight))
                this.extensions.push(new GridBlock().setPosition(-this.origin.fullWidth * x, y * this.origin.fullHeight))
                this.extensions.push(new GridBlock().setPosition(this.origin.fullWidth * x, -y * this.origin.fullHeight))
                this.extensions.push(new GridBlock().setPosition(-this.origin.fullWidth * x, -y * this.origin.fullHeight))
            }
        }

        this.addChild(this.origin)
        this.extensions.forEach(x => this.addChild(x))
    }
}