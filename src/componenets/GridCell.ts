const ISO_ANGLE = Math.PI / 6
const X_LENGTH = Math.cos(ISO_ANGLE)
const Y_LENGTH = Math.sin(ISO_ANGLE)

export class GridCell
{
    public readonly xTarget: number
    public readonly yTarget: number

    public readonly topLeft: Phaser.Point
    public readonly topRight: Phaser.Point
    public readonly bottomCenter: Phaser.Point

    constructor(
        public readonly sideLength: number,
    )
    {
        this.xTarget = X_LENGTH * this.sideLength
        this.yTarget = Y_LENGTH * this.sideLength

        this.topLeft = new Phaser.Point(-this.xTarget, -this.yTarget)
        this.topRight = new Phaser.Point(this.xTarget, -this.yTarget)
        this.bottomCenter = new Phaser.Point(0, sideLength)
    }
}