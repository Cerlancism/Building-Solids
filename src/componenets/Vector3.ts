export class Vector3
{
    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number = 0)
    {
        this.x = x
        this.y = y
        this.z = z
    }

    cascade(setter: (self: this) => void)
    {
        setter(this)
        return new Vector3(this.x, this.y, this.z)
    }

    equals(position: Vector3)
    {
        return this.x === position.x && this.y === position.y && this.z === position.z
    }

    toString()
    {
        return JSON.stringify(this)
    }
}