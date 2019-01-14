import { GameObject } from "/extensions/phaser/";
import { IBuildingGrid, IGridBase, IGridBlock, IGridCell, IGridContext, IGridObject, VectorIso3 } from "./core";

import { GridDots } from "./GridDots";
import { GridBlock } from "./GridBlock";
import { GridBase } from "./GridBase";


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
        spreadSizeY: number
    )
    {
        super()
        const gridCell = this.gridCell = gridContext.gridCell

        const oddPlus = (x: number) => Functors.odd(x, 1)
        const mirrorRowTarget = (x: number, i: number) => x === rowMax ? rowTarget(i) : x
        const rowTarget = (x: number) => Math.min(oddPlus(x), rowMax)

        const totalRange = Enumerable.range(0, spreadSizeX + spreadSizeY - 1)
        const rowMax = totalRange.map(oddPlus)[Math.min(spreadSizeX, spreadSizeY) - 1]
        const rows = totalRange.map(rowTarget)
            .reverse()
            .map(mirrorRowTarget)
            .reverse()

        const coordinates = totalRange.map(x => Enumerable.range(0, rows[x])
            .map(y =>
            {
                const xPoint = x < spreadSizeX ? -x + y : x - spreadSizeX * 2 + 2 + y
                const coordinate = new VectorIso3(xPoint, x)
                return { grid: coordinate, screen: coordinate.to2D(gridCell.sideLength) }
            })
        )

        this.gridBases = coordinates.flatMap(r => r.map(x => new GridBase(gridContext, x.grid).withParent(this)))

        this.gridDots = new GridDots(gridContext, this.gridBases).withParent(this)

        gridContext.onGridHover.add(() => 
        {
            this.gridBases.forEach(x =>
            {
                x.ensurePointerHover()
                x.sortBlocks(this)
            })
        })

        gridContext.onGridClick.add(() => 
        {
            const reverseGrid = this.gridBases.slice().reverse()
            for (const item of reverseGrid)
            {
                const position = item.ensurePointerClick()
                if (position)
                {
                    item.setInputActive(false)
                    this.addBlock(position)
                    return
                }
            }
        })

        const getGridMinMax = (
            selector: Functors.Selector<IGridBase, number>,
            comparer: Functors.Comparer<number>
        ) => this.gridBases.reduce(Functors.selectMinMax(selector, comparer)).gridPosition

        const [selectGridX, selectGridY] = [(x: IGridObject) => x.gridPosition.x, (x: IGridObject) => x.gridPosition.y]

        this.minMax = {
            maxX: getGridMinMax(selectGridX, Functors.moreThan),
            minX: getGridMinMax(selectGridX, Functors.lessThan),
            maxY: getGridMinMax(selectGridY, Functors.moreThan),
            minY: getGridMinMax(selectGridY, Functors.lessThan)
        }

        this.gridCenter = new VectorIso3((this.minMax.maxX.x + this.minMax.minX.x) / 2, (this.minMax.maxY.y + this.minMax.minY.y) / 2).round(1)
    }


    addBlock(position: VectorIso3)
    {
        const base = this.getBase(position)

        if (base)
        {
            const block = new GridBlock(this.gridContext, base.gridPosition).withParent(this)
            this.blocks.push(block)
            base.attach(block)
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
            x.sortBlocks(this)
        })
        console.timeEnd("Sorting blocks")
    }
}