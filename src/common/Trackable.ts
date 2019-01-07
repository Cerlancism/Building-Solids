interface IUpdateCallback<T>
{
    (currentValue: T, oldValue?: T): void;
}

export class Trackable<T>
{
    public value: T;
    public onUpdateCallback: IUpdateCallback<T>

    constructor(value: T, callBack?: IUpdateCallback<T>)
    {
        this.value = value;
        this.onUpdateCallback = callBack;
    }

    track(value: T, callBack?: IUpdateCallback<T>, overrideCallBack = true): boolean
    {
        if (this.value != value)
        {
            var oldValue = this.value;
            this.value = value;
            if (callBack) 
            {
                callBack(this.value, oldValue);
            }
            if (this.onUpdateCallback)
            {
                if (!(callBack && overrideCallBack))
                {
                    this.onUpdateCallback(this.value, oldValue);
                }
            }
            return true;
        }
        return false;
    }

    toString()
    {
        return `{ ${Trackable.name}<${this.value.constructor.name}>: ${this.value} }`;
    }
}