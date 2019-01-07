/**
 * @global
 */
module Enumberable
{
    export function flatten<T>(arr: T[][]): T[]
    {
        return arr.reduce(function (flat, toFlatten)
        {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten as any) : toFlatten);
        }, []);
    }

    export function repeat<T>(value: T, count: number): T[]
    {
        return Array(count).fill(value);
    }

    export function range(start: number, count: number)
    {
        return repeat(start, count).map((x, i) => x + i);
    }
}

(window as any).Enumberable = Enumberable