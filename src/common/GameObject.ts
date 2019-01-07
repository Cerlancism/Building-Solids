export class GameObject extends Phaser.Group
{
    constructor(parent?: PIXI.DisplayObjectContainer, name?: string, addToStage?: boolean, enableBody?: boolean, physicsBodyType?: number, game = GameInstance)
    {
        super(game, parent, name, addToStage, enableBody, physicsBodyType)
    }

    public getComponent<T extends GameObject>(type: new (..._: any) => T): T
    {
        return Object.values(this).find(x => x instanceof type)
    }

    public getPIXIComponent<T extends PIXI.DisplayObjectContainer>(type: new (..._: any) => T): T
    {
        return Object.values(this).find(x => x instanceof type)
    }

    /**
     * https://en.wikipedia.org/wiki/Method_cascading
     */
    public cascade(setter: (self: this) => void)
    {
        setter(this)
        return this
    }

    public setPosition(x: number, y: number)
    {
        return this.cascade(z => z.position.set(x, y))
    }
}