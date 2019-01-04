import 'phaser-ce'

declare global
{
    const GameInstance: Phaser.Game

    function debugLog(message: any, prefix?: string, preFixWrapper?: (log: string) => string)
    function infoLog(message: any)

    interface Window
    {
        PIXI: typeof PIXI
        p2: typeof p2
        Phaser: typeof Phaser
        GameInstance: typeof GameInstance
    }
}