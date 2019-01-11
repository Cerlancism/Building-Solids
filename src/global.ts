// Using require for global scope mounting because ES import does not guarantee load order
self.PIXI = require('phaser-ce/build/custom/pixi')
self.p2 = require('phaser-ce/build/custom/p2')
self.Phaser = require('phaser-ce/build/custom/phaser-split')

import '/extensions/common/PolyFills'
import '/extensions/common/Enumerable'
import '/utilities/Logger'
import '/utilities/Functors'
