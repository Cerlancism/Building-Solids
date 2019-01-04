type Signal = Phaser.Signal

export module AsyncEvent
{
    /**
     * Wait for a specified game time in Phaser.
     * @param milliseconds Time to wait
     * @param game Optional game instance
     */
    export function delayAsync(milliseconds: number, game = GameInstance)
    {
        return new Promise(resolve => game.time.events.add(milliseconds, resolve))
    }

    /**
     * Convert a phaser event(signal) to promise(for with use async/await)
     * @param signal Phaser Signal
     */
    export function signalAsync(signal: Signal)
    {
        return new Promise(resolve => signal.addOnce(() => resolve(signal))) as Promise<Signal>
    }

    /**
     * Wait for next frame
     * @returns Promise of delta time in milliseconds.
     */
    export function nextFrameAsync()
    {
        const startTime = performance.now()
        return new Promise(resolve => requestAnimationFrame((number) => resolve(number - startTime))) as Promise<Number>
    }

    /**
     * Wait for some frames
     * @param count Frames to skip.
     * @returns Promise of time passed in milliseconds
     */
    export async function skipFramesAsync(count: number)
    {
        const startTime = performance.now()
        while (count-- , count > -1)
        {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return Promise.resolve(performance.now() - startTime)
    }
}