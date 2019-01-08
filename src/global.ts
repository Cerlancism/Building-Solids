// Using require for global scope mounting because ES import does not guarantee load order
window.PIXI = require('phaser-ce/build/custom/pixi')
window.p2 = require('phaser-ce/build/custom/p2')
window.Phaser = require('phaser-ce/build/custom/phaser-split')

import './utilities/PolyFills'
import './utilities/Enumerable'
import './utilities/Logger'