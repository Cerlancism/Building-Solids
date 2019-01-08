import { IGridCell } from "../core/IGridCell";

const ISO_ANGLE = Math.PI / 6
const X_LENGTH = Math.cos(ISO_ANGLE)
const Y_LENGTH = Math.sin(ISO_ANGLE)

export class GridCell implements IGridCell
{
    private readonly xTarget: number
    private readonly yTarget: number

    public readonly topLeft: Phaser.Point
    public readonly topRight: Phaser.Point
    public readonly bottomCenter: Phaser.Point
    public readonly topCenter: Phaser.Point;
    public readonly bottonRight: Phaser.Point;
    public readonly bottonLeft: Phaser.Point;

    public readonly fullWidth: number

    constructor(
        public readonly sideLength: number,
    )
    {
        this.xTarget = X_LENGTH * this.sideLength
        this.yTarget = Y_LENGTH * this.sideLength

        this.topLeft = new Phaser.Point(-this.xTarget, -this.yTarget)
        this.topRight = new Phaser.Point(this.xTarget, -this.yTarget)
        this.bottomCenter = new Phaser.Point(0, sideLength)
        this.topCenter = new Phaser.Point(0, -sideLength)
        this.bottonLeft = new Phaser.Point(-this.xTarget, this.yTarget)
        this.bottonRight = new Phaser.Point(this.xTarget, this.yTarget)

        this.fullWidth = this.xTarget * 2
    }
}