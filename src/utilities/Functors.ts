namespace Functors
{
    export type Selector<T, U> = (x: T) => U
    export type Comparer<T> = (x: T, y: T) => boolean

    export function selectiveComparison<T, U>(selector: Selector<T, U>, comparer: Comparer<U>)
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

    export function sum(numbers: number[])
    {
        return numbers.reduce((x, y) => x + y, 0)
    }

    export function average(numbers: number[])
    {
        return sum(numbers) / numbers.length
    }

    export function fuzzyRound(value: number, precision: number)
    {
        return Math.round(value * (1 / precision)) / (1 / precision);
    }
}

(self as any).Functors = Functors
