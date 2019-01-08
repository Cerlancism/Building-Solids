const SQRT_2 = Math.sqrt(2)
const SQRT_6 = Math.sqrt(6)

export class VectorIso3
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

    public to2D(multiplier = 1)
    {
        const x = (this.x - this.y) / SQRT_2
        const y = (this.x + 2 * this.z + this.y) / SQRT_6

        return new Phaser.Point(x * multiplier, y * multiplier)
    }

    add(value: VectorIso3)
    {
        const { x, y, z } = value;
        return new VectorIso3(this.x + x, this.y + y, this.z + z)
    }

    substract(value: VectorIso3)
    {
        const { x, y, z } = value;
        return new VectorIso3(this.x - x, this.y - y, this.z - z)
    }

    multiply(value: number)
    {
        return new VectorIso3(this.x * value, this.y * value, this.z * value)
    }

    cascade(setter: (self: this) => void)
    {
        setter(this)
        return this
    }

    equals(position: VectorIso3)
    {
        return this.x === position.x && this.y === position.y && this.z === position.z
    }

    toString()
    {
        return JSON.stringify(this)
    }
}