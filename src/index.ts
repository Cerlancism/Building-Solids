import '/global'

const { Boot, Preloader, SolidBuilding } = require<{ [keys in any]: { new(): Phaser.State } & { key: string, onCreate: Phaser.Signal } }>("/states")


window.PROJECT_CODE = "BUILDING_SOLIDS"

if (location.hostname === "localhost")
{
    const buildNumberPropertyName = PROJECT_CODE + "_BuildNumber"
    const buildNumber = (JSON.parse(localStorage.getItem(buildNumberPropertyName)) || 0) as number + 1

    console.info(`%c[${PROJECT_CODE}] %cBuild:${buildNumber}`, "color:yellow", "color:blue; font-size:36px; font-weight:bold")

    localStorage.setItem(buildNumberPropertyName, JSON.stringify(buildNumber))
}

!(async () =>
{
    if (!window.GameInstance)
    {
        window.GameInstance = await startGameAsync()
    }
})()

async function startGameAsync()
{
    return new Promise<Phaser.Game>(resolve =>
    {
        Phaser.Device.whenReady((device: Phaser.Device) =>
        {
            infoLog("Device Ready")
            const isOffline = location.protocol === "file:"

            const config: Phaser.IGameConfig =
            {
                renderer: device.ie || isOffline && device.chrome ? Phaser.CANVAS : Phaser.AUTO, // IE cannot play videos in WebGL. Chrome will emit CORS errors if using WebGL offline.
                parent: 'content',
                width: 800,
                height: 600,
                alignH: true,
                alignV: true,
                antialias: true,
                resolution: 1,
                maxPointers: 1,
                backgroundColor: '#FFFFFF',
                state: Boot
            }

            const container = document.querySelector<HTMLDivElement>("#content")
            container.style.setProperty("visibility", "hidden")

            const game = new Phaser.Game(config)

            game.state.add(Preloader.key, Preloader)
            game.state.add(SolidBuilding.key, SolidBuilding)

            Boot.onCreate.addOnce(() =>
            {
                game.state.start(Preloader.key)
                container.style.removeProperty("visibility")
            })

            Preloader.onCreate.addOnce(() =>
            {
                game.state.start(SolidBuilding.key)
            })

            resolve(game)
        })
    })
}

if (module.hot)
{
    module.hot.dispose(destroyGame)
    module.hot.accept(() => console.log("[HMR]", "Accept"))
}

function destroyGame()
{
    console.log("[HMR] Destroy Game")
    if (window.GameInstance)
    {
        window.GameInstance.destroy()
        window.GameInstance = null
    }
    else
    {
        location.reload()
    }
}