/**
 * @global
 */
module Enumberable
{
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