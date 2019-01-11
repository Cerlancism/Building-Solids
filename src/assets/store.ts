import * as UI from './ui/*.png'
import * as Game from './game/*.png'

type UIKeyStore =
    | 'preloader_bar'

type UIKeyValuePair = { [key in UIKeyStore]: string }

type GameAssetKeyStore = ''

type GameAssetKeyValuePair = { [key in GameAssetKeyStore]: string }

export const UIKeyValues = UI as UIKeyValuePair
export const UIKeys = getKeys<UIKeyValuePair>(UI)
export const GameAssetValues = Game as GameAssetKeyValuePair
export const GameAssetKeys = getKeys<GameAssetKeyValuePair>(Game)

function getKeys<T>(files: Object): T
{
    let keys: T = {} as T
    for (const key in files)
    {
        if (files.hasOwnProperty(key))
        {
            keys[key] = key
        }
    }
    return keys
}







