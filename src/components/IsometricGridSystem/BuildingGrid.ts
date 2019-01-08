import { GameObject } from "/common/GameObject";
import { VectorIso3 } from "./entities/VectorIso3";
import { GridConfig } from "./entities/GridConfig";
import { GridCell } from "./entities/GridCell";
import { GridBase } from "./GridBase";
import { GridBlock } from "./GridBlock";

export class BuildingGrid extends GameObject
{
    origin: GridBase
    extensions: GridBase[][] = []
    extensionsFlat: GridBase[]
    blocks: GridBlock[] = []
    gridCell: GridCell

    constructor(spreadSizeX: number, spreadSizeY: number, gridConfig: GridConfig)
    {
        super()

        this.origin = new GridBase(gridConfig).cascade(x => this.add(x))
        const gridCell = this.gridCell = gridConfig.gridCell

        for (let x = 0; x < spreadSizeX; x++)
        {
            let row: GridBase[] = []
            for (let y = 0; y < spreadSizeY; y++)
            {
                row.push(new GridBase(gridConfig)
                    .setPosition(gridCell.fullWidth * x, gridCell.sideLength * y)
                    .cascade(z => z.gridPosition = new VectorIso3(x + y, -y + x)))
                y < (spreadSizeY - 1)
                    && x < (spreadSizeX - 1)
                    && row.push(new GridBase(gridConfig)
                        .setPosition(gridCell.bottonRight.x + gridCell.fullWidth * x, gridCell.bottonRight.y + gridCell.sideLength * y)
                        .cascade(z => z.gridPosition = new VectorIso3(x + 1 + y, - y + x)))
            }
            this.extensions.push(row)
            this.extensions.reverse().forEach(x => x.forEach(y => this.addChild(y)))
        }

        this.extensionsFlat = this.extensions.flat()
    }

    get gridCenter()
    {
        const maxX = this.extensionsFlat.reduce((x, y) => x.gridPosition.x > y.gridPosition.x ? x : y).gridPosition
        const maxY = this.extensionsFlat.reduce((x, y) => x.gridPosition.y > y.gridPosition.y ? x : y).gridPosition
        const minY = this.extensionsFlat.reduce((x, y) => x.gridPosition.y < y.gridPosition.y ? x : y).gridPosition

        return new VectorIso3(maxX.x / 2, (maxY.y + minY.y) / 2)
    }

    addBlock(position: VectorIso3)
    {
        const targetPosition = this.getBase(position).position
        this.blocks.push(new GridBlock(0, this.gridCell.sideLength, 1)
            .cascade(x => this.addChild(x))
            .setPosition(targetPosition.x, targetPosition.y))
        return this
    }

    getBase(position: VectorIso3)
    {
        return this.extensionsFlat.find(x => x.gridPosition.equals(position))
    }
}