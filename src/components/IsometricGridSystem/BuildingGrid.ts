import { IBuildingGrid } from "./core/IBuildingGrid";
import { IGridBase } from "./core/IGridBase";
import { IGridBlock } from "./core/IGridBlock";
import { IGridCell } from "./core/IGridCell";
import { IGridContext } from "./core/IGridContext";
import { IGridObject } from "./core/IGridObject";

import { VectorIso3 } from "./entities/VectorIso3";
import { GridBase } from "./GridBase";
import { GridBlock } from "./GridBlock";
import { GridDots } from "./GridDots";
import { GameObject } from "../../extensions/phaser/GameObject";

export class BuildingGrid extends GameObject implements IBuildingGrid
{
    public readonly gridBases: IGridBase[]
    public readonly blocks: IGridBlock[] = []
    public readonly gridCell: IGridCell
    public readonly gridDots: GridDots

    public readonly minMax: { minX: VectorIso3; minY: VectorIso3; maxX: VectorIso3; maxY: VectorIso3 }
    public readonly gridCenter: VectorIso3

    constructor(
        private readonly gridContext: IGridContext,
        spreadSizeX: number,
        spreadSizeY: number)
    {
        super()
        const gridCell = this.gridCell = gridContext.gridCell

        const totalRange = Enumerable.range(0, spreadSizeX + spreadSizeY - 1)

        const oddPlus = (x: number) => Functors.odd(x, 1)
        const rowTarget = (x: number) => Math.min(oddPlus(x), rowMax)

        const rowMax = totalRange.map(oddPlus)[Math.min(spreadSizeX, spreadSizeY) - 1]
        const rows = totalRange.map(rowTarget)
            .reverse()
            .map((x, i) => x == rowMax ? rowTarget(i) : x)
            .reverse()

        const coordinates = totalRange.map(x => Enumerable.range(0, rows[x])
            .map(y =>
            {
                const xPoint = x < spreadSizeX ? -x + y : x - spreadSizeX * 2 + 2 + y
                const coordinate = new VectorIso3(xPoint, x)
                return { grid: coordinate, screen: coordinate.to2D(gridCell.sideLength) }
            })
        )

        this.gridBases = coordinates.flatMap(f => f.map(x => new GridBase(gridContext, x.grid).withParent(this)))

        this.gridDots = new GridDots(gridContext, this.gridBases).withParent(this)

        gridContext.onGridHover.add(() => 
        {
            this.gridBases.forEach(x => x.ensurePointerHover())
        })

        gridContext.onGridClick.add(() => 
        {
            const reverseGrid = this.gridBases.slice().reverse()
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

        const getGridMinMax = (
            selector: Functors.Selector<IGridBase, number>,
            comparer: Functors.Comparer<number>
        ) => this.gridBases.reduce(Functors.getMinMax(selector, comparer)).gridPosition

        const [selectGridX, selectGridY] = [<T extends IGridObject>(x: T) => x.gridPosition.x, <T extends IGridObject>(x: T) => x.gridPosition.y]

        this.minMax = {
            maxX: getGridMinMax(selectGridX, Functors.moreThan),
            minX: getGridMinMax(selectGridX, Functors.lessThan),
            maxY: getGridMinMax(selectGridY, Functors.moreThan),
            minY: getGridMinMax(selectGridY, Functors.lessThan)
        }

        this.gridCenter = new VectorIso3((this.minMax.maxX.x + this.minMax.minX.x) / 2, (this.minMax.maxY.y + this.minMax.minY.y) / 2).round(1)

        this.addBlock(this.gridCenter)
    }


    addBlock(position: VectorIso3)
    {
        const base = this.getBase(position)

        if (base)
        {
            const block = new GridBlock(this.gridContext, base.gridPosition).withParent(this)
            this.blocks.push(block)
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
        return this.getGridObject(position, this.gridBases)
    }

    private getGridObject<T extends IGridObject>(position: VectorIso3, objects: T[])
    {
        return objects.find(x => x.gridPosition.equals(position))
    }

    private sortBlocks(): void
    {
        console.time("Sorting blocks")
        this.gridBases.forEach(x => 
        {
            const block = this.getGridObject(x.gridPosition, this.blocks)
            if (block)
            {
                this.bringToTop(block)
            }
        })
        console.timeEnd("Sorting blocks")
    }
}