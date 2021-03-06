# Phaser CE Volume of Solids

<div align="center">
<img src="https://raw.githubusercontent.com/Cerlancism/Phaser-CE-TypeScript-ParcelJS/master/Banner.png" width="640" alt="Banner" />
</div>

### Try out here
<https://cerlancism.github.io/Building-Solids/build>

## Features
- Using [Parcel bundler](https://parceljs.org/) as a seamless and lightweight build tool.  
    - Bulk import assets using glob file patterns.
    - Hot Module Replacement (fast game reload in browser during development)
    - Minification for build output
    - Source mapping
- Supports modern ECMA syntax as well as typings/intelliSense from [TypeScript](http://www.typescriptlang.org/).
- Backwards compatible up to Internet Explorer 9 with [Babel](https://babeljs.io/) transformations and polyfills.
- The build output playable offline.

## Installation
- Recommended Editor: [Visual Studio Code](https://code.visualstudio.com/)
- [NodeJS](https://nodejs.org/en/)
- `npm install -g typescript`
- `npm install -g parcel-bundler`

## Set Up
Clone this repository.

Open this folder in Visual Studio code and from menu:  
`Terminal -> New Terminal`

`npm start` To develop (work in `src` folder, creates `dev` folder)

`npm run build` To build (minify and offline play, creates `build` folder)

`npm run deploy` To deploy (build with no source map, creates `.deploy` folder)

## Important Note
Due to the bundling and limitation of mounting of Phaser to window scope, do not use destructuring ES module imports from Phaser, for example:  
``` ts
// Do not use ES Modules for Phaser
import { Game, IGameConfig } from 'phaser-ce'
// But you can do this for your own modules.
import { Logger } from '/utilities'
 
const config: IGameConfig = { /* Configs */ }
const game = new Game(config)

Logger.log("Game Created")
```
This will cause the build size to bloat as Phaser will be included twice.  
Do use Phaser as namespace:  
``` ts
import { Logger } from '/utilities'

const config: Phaser.IGameConfig = { /* Configs */ }
const game = new Phaser.Game(config)

Logger.log("Game Created")
```

## Credits
- Example game and assets from [Phaser 2 Examples](https://github.com/photonstorm/phaser-examples)
- [Phaser 3 TypeScript Webpack](https://github.com/troyedwardsjr/phaser3-typescript-webpack)
- [Phaser 3 with Parcel](https://github.com/samme/phaser-parcel)
