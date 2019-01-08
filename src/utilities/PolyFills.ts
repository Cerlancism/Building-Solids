if (!Array.prototype.flat)
{
    (Array.prototype as any).flat = function ()
    {
        return [].concat(...this)
    }
}