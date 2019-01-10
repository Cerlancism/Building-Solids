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

    public readonly minMax: { minX: VectorIso3; minY: VectorIso3; maxX: VectorIso3; maxY: VectorIso3 }
    public readonly gridCenter: VectorIso3

    constructor(private readonly gridContext: IGridContext, spreadSizeX: number, spreadSizeY: number)
    {
        super()
        const gridCell = this.gridCell = gridContext.gridCell

        const totalRange = Enumerable.range(0, spreadSizeX + spreadSizeY - 1)

        const oddMore = (x: number) => x * 2 + 1
        const rowTarget = (x: number) => Math.min(oddMore(x), rowMax)

        const rowMax = totalRange.map(oddMore)[Math.min(spreadSizeX, spreadSizeY) - 1]
        const rows = totalRange.map(rowTarget)
            .reverse()
            .map((x, i) => x == rowMax ? rowTarget(i) : x)
            .reverse()

        const coordinates = totalRange
            .map(x =>
            {
                return Enumerable.range(0, rows[x])
                    .map(y =>
                    {
                        const xPoint = x < spreadSizeX ? -x + y : x - spreadSizeX * 2 + 2 + y
                        const coordinate = new VectorIso3(xPoint, x)
                        return { grid: coordinate, screen: coordinate.to2D(gridCell.sideLength) }
                    })
            })
            .flat()


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
                const position = item.ensurePointerClick()
                if (position)
                {
                    this.addBlock(position)
                    return
                }
            }
        })

        this.minMax =
            {
                maxX: this.extensionsFlat.reduce((x, y) => x.gridPosition.x > y.gridPosition.x ? x : y).gridPosition,
                minX: this.extensionsFlat.reduce((x, y) => x.gridPosition.x < y.gridPosition.x ? x : y).gridPosition,
                maxY: this.extensionsFlat.reduce((x, y) => x.gridPosition.y > y.gridPosition.y ? x : y).gridPosition,
                minY: this.extensionsFlat.reduce((x, y) => x.gridPosition.y < y.gridPosition.y ? x : y).gridPosition
            }

        this.gridCenter = new VectorIso3((this.minMax.maxX.x + this.minMax.minX.x) / 2, (this.minMax.maxY.y + this.minMax.minY.y) / 2).round(1)
    }


    addBlock(position: VectorIso3)
    {
        const base = this.getBase(position)

        if (base)
        {
            const targetPosition = base.position
            this.blocks.push(new GridBlock(this.gridContext, base.gridPosition)
                .withParent(this)
                .setPosition(targetPosition.x, targetPosition.y))
            this.sortBlocks()
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

    private sortBlocks(): void
    {
        console.time("Sorting blocks")
        this.extensionsFlat.forEach(x => 
        {
            const block = this.blocks.find(y => y.gridPosition.equals(x.gridPosition))
            if (block)
            {
                this.bringToTop(block)
            }
        })
        console.timeEnd("Sorting blocks")
    }
}