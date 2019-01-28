export class Lazy<T>
{
    private _value: T
    private getValueFunc: () => T

    constructor(
        initialiser: () => T
    )
    {
        this._value = null

        this.getValueFunc = () =>
        {
            this._value = initialiser()
            this.getValueFunc = () => this._value
            return this.value
        }
    }

    public get hasValue()
    {
        return this._value != null;
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