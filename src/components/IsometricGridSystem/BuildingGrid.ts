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

        const coordinates = Enumberable.range(0, spreadSizeX)
            .map(x => Enumberable.range(0, spreadSizeY)
                .map(y =>
                {
                    const coordinate = new VectorIso3(x, y)
                    return ({ local: coordinate, screen: coordinate.to2D(gridCell.sideLength) });
                }))
            .flat()
            .concat(Enumberable.range(0, spreadSizeX / 2)
                .map(x => Enumberable.range(0, spreadSizeY / 2)
                    .map(y =>
                    {
                        const coordinate = new VectorIso3(x, y, 1)
                        return ({ local: coordinate, screen: coordinate.to2D(gridCell.sideLength) });
                    }))
                .flat())

        this.extensionsFlat = coordinates.map(x => new GridBase(gridContext, x.local).setPosition(x.screen.x, x.screen.y).withParent(this))

        this.gridDots = new GridDots(gridContext, this.extensionsFlat).withParent(this)

        gridContext.onGridHover.add(() => 
        {
            this.extensionsFlat.forEach(x => x.ensurePointerHover())
        })

        gridContext.onGridClick.add(() => 
        {
            this.extensionsFlat.forEach(x => x.ensurePointerClick())
        })
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