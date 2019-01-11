export const ISO_ANGLE = Math.PI / 6
export const X_POJECTON = Math.cos(ISO_ANGLE)
export const Y_PROJECTION = Math.sin(ISO_ANGLE)

export class VectorIso3
{
    /** On ground plane, from origin to botton right */
    x: number
    /** On ground plane, from origin to botton left */
    y: number
    /** The vertical height */
    z: number

    constructor(x: number = 0, y: number = x, z: number = 0)
    {
        this.x = x
        this.y = y
        this.z = z
    }

    public to2D(multiplier = 1)
    {
        const x = (this.x - this.y) * X_POJECTON
        const y = (this.x - (2 * this.z) + this.y) * Y_PROJECTION

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

    public setValueAt(x?: number, y?: number, z?: number): VectorIso3
    public setValueAt(selector: (x: VectorIso3) => number): VectorIso3

    public setValueAt(initial: ((x: VectorIso3) => number) | number, y?: number, z?: number): VectorIso3
    {
        if (typeof initial != 'function')
        {
            return new VectorIso3(initial == undefined ? this.x : initial, y == undefined ? this.y : y, z == undefined ? this.z : z)
        }
        else
        {
            const output = new VectorIso3(this.x, this.y, this.z)
            initial(output)
            return output
        }
    }

    public offSetValueAt(x: number = 0, y: number = 0, z: number = 0)
    {
        return new VectorIso3(this.x + x, this.y + y, this.z + z)
    }

    public multiply(value: number)
    {
        return new VectorIso3(this.x * value, this.y * value, this.z * value)
    }

    public cascade(setter: (self: VectorIso3) => void)
    {
        const { x, y, z } = this
        const output = new VectorIso3(x, y, z)
        setter(output)
        return output
    }

    public round(precision: number)
    {
        const rounder = (x: number) => Functors.fuzzyRound(x, precision)
        const { x, y, z } = this
        return new VectorIso3(rounder(x), rounder(y), rounder(z))
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