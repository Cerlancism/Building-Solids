import 'babel-polyfill'
import '/global'

const { Boot, Preloader, SolidBuilding } = require("/states")

!(async () =>
{
    if (!window.GameInstance)
    {
        window.GameInstance = await startGame()
    }
})()

async function startGame()
{
    return new Promise<Phaser.Game>(resolve =>
    {
        Phaser.Device.whenReady((device: Phaser.Device) =>
        {
            console.log("Device Ready")
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

            document.querySelector<HTMLDivElement>("#content").style.setProperty("visibility", "hidden")

            const game = new Phaser.Game(config)
            game.state.add(Preloader.name, Preloader)
            game.state.add(SolidBuilding.name, SolidBuilding)

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
    window.GameInstance.destroy()
    window.GameInstance = null
}