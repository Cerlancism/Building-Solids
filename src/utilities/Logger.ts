(() =>
{
    (self as any).debugLog = function (message: any, prefix = "DEBUG", preFixWrapper = (log: string) => `[${log}]`)
    {
        log(message, prefix, preFixWrapper, console.log);
    };

    (self as any).infoLog = function (message: any)
    {
        log(message, "INFO", undefined, console.info);
    };

    function log(message: any, prefix = "DEBUG", preFixWrapper = (log: string) => `[${log}]`, logger: (messsage: any, ...optionalParams: any[]) => void = console.log, ...optionalParams: any[])
    {
        try
        {
            var output: object | string;
            if (typeof (message) == "string")
            {
                output = `${preFixWrapper(prefix)} ${message}`;
            }
            else
            {
                output = `${preFixWrapper(prefix)} ${(message as object).constructor.name}`;
                optionalParams.push(message)
            }

            logger(output, ...optionalParams);
        }
        catch (error)
        {
            if (console && console.error)
            {
                console.error(error);
            }
        }
    }
})()

