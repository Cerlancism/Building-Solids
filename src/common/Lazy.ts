export class Lazy<T>
{
    private _value: T

    constructor(
        private initialiser: () => T
    )
    {
        this._value = null
    }

    private getValueFunc: () => T = () =>
    {
        this._value = this.initialiser()
        this.getValueFunc = () => this._value
        return this.value
    }

    public get value()
    {
        return this.getValueFunc()
    }

    public set value(value: T)
    {
        this._value = value
    }
}