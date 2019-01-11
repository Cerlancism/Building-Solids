import { IGridCell, X_POJECTON, Y_PROJECTION } from "../core";

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
        this.xTarget = X_POJECTON * this.sideLength
        this.yTarget = Y_PROJECTION * this.sideLength

        this.topLeft = new Phaser.Point(-this.xTarget, -this.yTarget)
        this.topRight = new Phaser.Point(this.xTarget, -this.yTarget)
        this.bottomCenter = new Phaser.Point(0, sideLength)
        this.topCenter = new Phaser.Point(0, -sideLength)
        this.bottonLeft = new Phaser.Point(-this.xTarget, this.yTarget)
        this.bottonRight = new Phaser.Point(this.xTarget, this.yTarget)

        this.fullWidth = this.xTarget * 2
    }
}