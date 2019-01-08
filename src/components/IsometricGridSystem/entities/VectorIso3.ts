const SQRT_2 = Math.sqrt(2)
const SQRT_6 = Math.sqrt(6)

export class VectorIso3
{
    /** On ground plane, from origin to top right */
    x: number
    /** On ground plane, from origin to top left */
    y: number
    /** The vertical height */
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

    public add(value: VectorIso3)
    {
        const { x, y, z } = value;
        return new VectorIso3(this.x + x, this.y + y, this.z + z)
    }

    public substract(value: VectorIso3)
    {
        const { x, y, z } = value;
        return new VectorIso3(this.x - x, this.y - y, this.z - z)
    }

    public multiply(value: number)
    {
        return new VectorIso3(this.x * value, this.y * value, this.z * value)
    }

    public cascade(setter: (self: this) => void)
    {
        setter(this)
        return this
    }

    public round(precision: number)
    {
        function precisionRound(value: number)
        {
            return Math.round(value * (1 / precision)) / (1 / precision);
        }
        return new VectorIso3(precisionRound(this.x), precisionRound(this.y), precisionRound(this.z))
    }

    public equals(position: VectorIso3)
    {
        return this.x === position.x && this.y === position.y && this.z === position.z
    }

    public fuzzyEquals(position: VectorIso3, precision: number)
    {
        return this.round(precision).equals(position.round(precision))
    }

    public toString()
    {
        return JSON.stringify(this)
    }
}