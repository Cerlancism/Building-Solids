import { GameAssetKeys } from "/assets"
import { DeltaTimeDebug } from "/extensions/phaser/DeltaTimeDebug";
import { IsometricBuilder } from "/components/IsometricGridSystem";

export class SolidBuilding extends Phaser.State
{
    public static key = "SolidBuilding"

    public builder: IsometricBuilder

    init()
    {
        debugLog(this.key, "State Init")
    }

    create()
    {
        this.builder = new IsometricBuilder().setPosition(30, 120)

        const deltaTimer = new DeltaTimeDebug()
    }

    update()
    {

    }

    render()
    {

    }
}
