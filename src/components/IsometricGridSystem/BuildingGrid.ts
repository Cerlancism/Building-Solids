import { GameObject } from "/extensions/phaser/";
import { IBuildingGrid, IGridBase, IGridBlock, IGridCell, IGridContext, IGridObject, VectorIso3 } from "./core";

import { GridDots } from "./GridDots";
import { GridBlock } from "./GridBlock";
import { GridBase } from "./GridBase";

const STRICT_MODE = false

export class BuildingGrid extends GameObject implements IBuildingGrid
{
    public readonly gridBases: IGridBase[]
    public readonly blocks: IGridBlock[] = []
    public readonly gridCell: IGridCell
    public readonly gridDots: GridDots

    public readonly minMax: { minX: VectorIso3; minY: VectorIso3; maxX: VectorIso3; maxY: VectorIso3 }
    public readonly gridCenter: VectorIso3

    /**
     * Dispatches a boolean for the current active state
     */
    public readonly onEnableChanged: Phaser.Signal

    public readonly onGridHover: Phaser.Signal

    private hoverBlock: IGridBlock

    constructor(
        private readonly gridContext: IGridContext,
        spreadSizeX: number,
        spreadSizeY: number
    )
    {
        super()
        this.onEnableChanged = new Phaser.Signal()
        this.onGridHover = new Phaser.Signal()

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

        const blindSpots = coordinates.map(x => [x[0], x[x.length - 1]]).flatMap(x => x)

        this.gridBases = coordinates.flatMap(r => r.map(x => new GridBase(gridContext, x.grid).withParent(this)))
        this.gridBases.forEach(x => blindSpots.some(y => x.gridPosition.equals(y.grid)) ? x.hardDisable() : x.setInputActive(true))

        this.gridDots = new GridDots(gridContext, this.gridBases).withParent(this)

        const getGridMinMax = (
            selector: Functors.Selector<IGridBase, number>,
            comparer: Functors.Comparer<number>
        ) => this.gridBases.reduce(Functors.selectiveComparison(selector, comparer)).gridPosition

        const [selectGridX, selectGridY] = [(x: IGridObject) => x.gridPosition.x, (x: IGridObject) => x.gridPosition.y]

        this.minMax = {
            maxX: getGridMinMax(selectGridX, Functors.moreThan),
            minX: getGridMinMax(selectGridX, Functors.lessThan),
            maxY: getGridMinMax(selectGridY, Functors.moreThan),
            minY: getGridMinMax(selectGridY, Functors.lessThan)
        }

        this.gridCenter = new VectorIso3((this.minMax.maxX.x + this.minMax.minX.x) / 2, (this.minMax.maxY.y + this.minMax.minY.y) / 2).round(1)

        this.gridContext.onGridHover.add((sender: IGridObject) => this.handleHover(sender))
        this.gridContext.onGridClick.add((position: VectorIso3) => this.handleGridClick(position))
        this.game.input.onUp.add((pointer: Phaser.Pointer) => this.handleGlobalClick(pointer))

        const getBound = (x: VectorIso3, selector: Functors.Selector<VectorIso3, number>, target: number) => Math.abs(selector(this.gridCenter) - selector(x)) < Math.round(target / 4)
        const restrictGrid = (x: VectorIso3) => getBound(x, y => y.x, Math.min(spreadSizeX, spreadSizeY)) && getBound(x, y => y.y, Math.min(spreadSizeX, spreadSizeY))
        const alignOffset = (x: VectorIso3) => x
        this.gridBases
            .map(x => x.gridPosition)
            .filter(restrictGrid)
            .map(alignOffset)
            .forEach(x => this.gridBases.find(y => y.gridPosition.equals(x)).setAllowBuild(true))
    }

    //#region Handlers ----------------------------------------------------------------------------

    private handleHover(sender: IGridObject)
    {
        if (sender instanceof GridBase)
        {
            const base = sender as IGridBase
            this.setHoverBlock(sender.gridPosition, base.allowBuild ? Phaser.Color.GREEN : Phaser.Color.RED)
        }
        if (sender instanceof GridBlock)
        {
            const target = sender.gridPosition.offSetValueAt(0, 0, 1)
            const visualBlockTarget = target.offSetValueAt(-1, -1)
            const visualBlock = this.getGridObject(visualBlockTarget, this.blocks)
            const visualBlockBase = this.getGridObject(visualBlockTarget.offSetValueAt(0, 0, -1), this.blocks)

            !(() =>
            {
                if (target.offSetValueAt(0, 0, 1).to2D(this.gridContext.gridCell.sideLength).y <= 0)
                {
                    this.setHoverBlock(target, Phaser.Color.RED)
                    return 0
                }
                if (STRICT_MODE)
                {
                    this.setHoverBlock(target, visualBlock ? Phaser.Color.GREEN : visualBlockBase ? Phaser.Color.RED : Phaser.Color.GREEN)
                }
                else
                {
                    this.setHoverBlock(target, visualBlock ? Phaser.Color.GREEN : visualBlockBase ? Phaser.Color.YELLOW : Phaser.Color.GREEN)
                }
                return 0
            })()
        }
        this.onGridHover.dispatch()
    }

    private handleGridClick(position: VectorIso3)
    {
        this.addBlock(position);
        this.destroyHoverBlock();
        this.setEnabled(false)
    }

    private handleGlobalClick(pointer: Phaser.Pointer)
    {
        if (pointer.isMouse && !pointer.leftButton.isDown && this.game.device.ieVersion != 9)
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
                    this.setEnabled(false)
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
                        && Math.abs(base.gridPosition.x - x.gridPosition.x) === 1)
                        .forEach(x => x.setAllowBuild(true))
                }
                base.setInputActive(false)
            }
            else
            {
                if (!this.hoverBlock.allowBuild)
                {
                    this.setEnabled(false)
                    return
                }
                this.getGridObject(this.hoverBlock.gridPosition.offSetValueAt(0, 0, -1), this.blocks).setInputActive(false)
            }
            this.gridContext.onGridClick.dispatch(this.hoverBlock.gridPosition)
        }
    }

    //#endregion

    //#region Mutators ----------------------------------------------------------------------------

    public addBlock(position: VectorIso3)
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

    private setHoverBlock(position: VectorIso3, tint: number)
    {
        this.destroyHoverBlock()
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

    public setEnabled(active: boolean)
    {
        if (!active)
        {
            this.destroyHoverBlock()
        }
        this.onEnableChanged.dispatch(active)
        return this
    }

    //#endregion

    public getBase(position: VectorIso3)
    {
        return this.getGridObject(position, this.gridBases)
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