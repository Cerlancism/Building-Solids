namespace Functors
{
    export type Selector<T, U> = (x: T) => U
    export type Comparer<T> = (x: T, y: T) => boolean

    export function getMinMax<T>(selector: Selector<T, number>, comparer: Comparer<number>)
    {
        return (x: T, y: T) => comparer(selector(x), selector(y)) ? x : y
    }

    export function moreThan(x: number, y: number)
    {
        return x > y
    }

    export function lessThan(x: number, y: number)
    {
        return x < y
    }

    export function odd(x: number, offset: 1 | -1)
    {
        return even(x) + offset
    }

    export function even(x: number)
    {
        return x * 2
    }
}

(self as any).Functors = Functors