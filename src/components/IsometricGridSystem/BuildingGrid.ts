import { IBuildingGrid } from "./core/IBuildingGrid";
import { IGridBase } from "./core/IGridBase";
import { IGridBlock } from "./core/IGridBlock";
import { IGridCell } from "./core/IGridCell";
import { IGridContext } from "./core/IGridContext";
import { VectorIso3 } from "./entities/VectorIso3";
import { GridBase } from "./GridBase";
import { GridBlock } from "./GridBlock";
import { GridDots } from "./GridDots";
import { GameObject } from "/components/GameObject";

export class BuildingGrid extends GameObject implements IBuildingGrid
{
    public readonly extensionsFlat: IGridBase[]
    public readonly blocks: IGridBlock[] = []
    public readonly gridCell: IGridCell
    public readonly gridDots: GridDots

    constructor(gridContext: IGridContext, spreadSizeX: number, spreadSizeY: number)
    {
        super()
        const gridCell = this.gridCell = gridContext.gridCell

        const baseRangeX = Enumberable.range(0, spreadSizeX)
        const baseRangeY = Enumberable.range(0, spreadSizeY)
        const totalRange = Enumberable.range(0, spreadSizeX + spreadSizeY - 1)
        const rowMax = totalRange.map(x => x * 2 + 1)[Math.min(spreadSizeX, spreadSizeY) - 1]
        const rows = totalRange.map(x => Math.min(x * 2 + 1, rowMax))
            .reverse()
            .map((x, i) => x == rowMax ? Math.min(i * 2 + 1, rowMax) : x)
            .reverse()

        const coordinates = totalRange
            .map(x =>
            {
                return Enumberable.range(0, rows[x]).map(y =>
                {
                    if (x < spreadSizeX)
                    {
                        const coordinate = new VectorIso3(-x + y, x)
                        return { grid: coordinate, screen: coordinate.to2D(gridCell.sideLength) }
                    }
                    else
                    {
                        const coordinate = new VectorIso3(x - spreadSizeX * 2 + 2 + y, x)
                        return { grid: coordinate, screen: coordinate.to2D(gridCell.sideLength) }
                    }
                })
            }).flat()


        this.extensionsFlat = coordinates.map(x => new GridBase(gridContext, x.grid).setPosition(x.screen.x, x.screen.y).withParent(this))

        this.gridDots = new GridDots(gridContext, this.extensionsFlat).withParent(this)

        gridContext.onGridHover.add(() => 
        {
            this.extensionsFlat.forEach(x => x.ensurePointerHover())
        })

        gridContext.onGridClick.add(() => 
        {
            const reverseGrid = this.extensionsFlat.slice().reverse()
            for (const item of reverseGrid)
            {
                if (item.ensurePointerClick())
                {
                    return
                }
            }
        })
    }

    get gridCenter()
    {
        const maxX = this.extensionsFlat.reduce((x, y) => x.gridPosition.x > y.gridPosition.x ? x : y).gridPosition
        const minX = this.extensionsFlat.reduce((x, y) => x.gridPosition.x < y.gridPosition.x ? x : y).gridPosition
        const maxY = this.extensionsFlat.reduce((x, y) => x.gridPosition.y > y.gridPosition.y ? x : y).gridPosition
        const minY = this.extensionsFlat.reduce((x, y) => x.gridPosition.y < y.gridPosition.y ? x : y).gridPosition

        return new VectorIso3((maxX.x + minX.x) / 2, (maxY.y + minY.y) / 2)
    }

    addBlock(position: VectorIso3)
    {
        const base = this.getBase(position)

        if (base)
        {
            const targetPosition = base.position
            this.blocks.push(new GridBlock(0, this.gridCell.sideLength, 1)
                .withParent(this)
                .setPosition(targetPosition.x, targetPosition.y))
        }
        else
        {
            debugLog(`Invalid grid position: ${position}`, "WARNING")
        }
        return this
    }

    getBase(position: VectorIso3)
    {
        return this.extensionsFlat.find(x => x.gridPosition.equals(position))
    }
}