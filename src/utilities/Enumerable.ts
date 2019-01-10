/**
 * @global
 */
module Enumerable
{
    export function repeat<T>(value: T, count: number): T[]
    {
        return Array(count).fill(value)
    }

    export function range(start: number, count: number)
    {
        const array = repeat(start, count)
        count += start
        while (start <= --count)
        {
            array[count - start] = count
        }
        return array
        // return repeat(start, count).map((x, i) => x + i)
    }
}

(window as any).Enumerable = Enumerable