import { GameObject } from "/extensions/phaser/";
import { IBuildingGrid, IGridBase, IGridBlock, IGridCell, IGridContext, IGridObject, VectorIso3 } from "./core";
import { GridObject } from "./base";

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

    private hoverBlock: IGridBlock

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

        this.gridContext.onGridHover.add((hover: IGridObject) =>
        {
            if (hover instanceof GridBase)
            {
                const base = hover as IGridBase
                this.setHoverBlock(hover.gridPosition, base.allowBuild ? Phaser.Color.GREEN : Phaser.Color.RED)
            }
            if (hover instanceof GridBlock)
            {
                const target = hover.gridPosition.offSetValueAt(0, 0, 1)
                const visualBlockTarget = target.offSetValueAt(-1, -1)
                const visualBlock = this.getGridObject(visualBlockTarget, this.blocks)
                const visualBlockBase = this.getGridObject(visualBlockTarget.offSetValueAt(0, 0, -1), this.blocks)
                this.setHoverBlock(target, visualBlock ? Phaser.Color.GREEN : visualBlockBase ? Phaser.Color.RED : Phaser.Color.GREEN)
            }
        })

        this.gridContext.onGridClick.add((position: VectorIso3) =>
        {
            this.addBlock(position)
            this.destroyHoverBlock()
        })

        this.game.input.onUp.add((pointer: Phaser.Pointer) =>
        {
            if (pointer.isMouse && !pointer.leftButton.isDown)
            {
                return
            }
            if (this.hoverBlock)
            {
                this.game.canvas.style.cursor = "default"
                if (this.hoverBlock.gridPosition.z === 0)
                {
                    const base = this.getBase(this.hoverBlock.gridPosition)
                    if (!base.allowBuild)
                    {
                        return
                    }
                    else
                    {
                        if (this.blocks.length === 0)
                        {
                            this.gridBases.forEach(x => x.setAllowBuild(false))
                        }
                        this.gridBases.filter(x => x.gridPosition.x === base.gridPosition.x
                            && Math.abs(base.gridPosition.y - x.gridPosition.y) === 1
                            || x.gridPosition.y === base.gridPosition.y
                            && Math.abs(base.gridPosition.x - x.gridPosition.x) === 1
                        )
                            .forEach(x => x.setAllowBuild(true))
                    }
                    base.setInputActive(false)
                }
                else
                {
                    if (!this.hoverBlock.allowBuild)
                    {
                        return
                    }
                    this.getGridObject(this.hoverBlock.gridPosition.offSetValueAt(0, 0, -1), this.blocks).setInputActive(false)
                }
                this.gridContext.onGridClick.dispatch(this.hoverBlock.gridPosition)
            }
        })

        const getBound = (x: VectorIso3, selector: Functors.Selector<VectorIso3, number>, target: number) => Math.abs(selector(this.gridCenter) - selector(x)) < target / 3
        const restrictGrid = (x: IGridBase) => getBound(x.gridPosition, y => y.x, spreadSizeX) && getBound(x.gridPosition, y => y.y, spreadSizeY)
        this.gridBases.filter(restrictGrid).forEach(x => x.setAllowBuild(true))
    }

    addBlock(position: VectorIso3)
    {
        const base = this.getBase(position) || this.getGridObject(position.offSetValueAt(0, 0, -1), this.blocks)

        if (base)
        {
            const block = new GridBlock(this.gridContext, position)
                .withParent(this)
                .cascade(x => x.setInputActive(true))
            this.blocks.push(block)
            base.attach(block)
            this.sortBlocks()
        }
        else
        {
            debugLog(`Invalid grid position: ${position}`, "WARNING")
        }

        debugLog(this.blocks.length, "Blocks")

        return this
    }

    getBase(position: VectorIso3)
    {
        return this.getGridObject(position, this.gridBases)
    }

    private setHoverBlock(position: VectorIso3, tint: number)
    {
        if (this.hoverBlock)
        {
            this.hoverBlock.destroy()
            this.hoverBlock = null
        }
        this.hoverBlock = new GridBlock(this.gridContext, position)
            .withParent(this)
            .cascade(x => x.alpha = 0.5)
            .cascade(x => x.setTint(tint))
        this.sortBlocks()
    }

    private destroyHoverBlock()
    {
        if (this.hoverBlock)
        {
            this.hoverBlock.destroy()
            this.hoverBlock = null
        }
    }

    private getGridObject<T extends IGridObject>(position: VectorIso3, gridObjects: T[])
    {
        return gridObjects.find(x => x.gridPosition.equals(position))
    }

    private sortBlocks(): void
    {
        this.gridBases.forEach(x => 
        {
            x.sortBlocks(this)
            if (this.hoverBlock)
            {
                if (x.gridPosition.x === this.hoverBlock.gridPosition.x && x.gridPosition.y === this.hoverBlock.gridPosition.y)
                {
                    this.bringToTop(this.hoverBlock)
                }
            }
        })
    }
}