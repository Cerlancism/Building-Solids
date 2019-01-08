export interface IGridCell
{
    readonly topLeft: Phaser.Point
    readonly topRight: Phaser.Point
    readonly bottomCenter: Phaser.Point
    readonly topCenter: Phaser.Point;
    readonly bottonRight: Phaser.Point;
    readonly bottonLeft: Phaser.Point;

    readonly fullWidth: number
    readonly sideLength: number
}