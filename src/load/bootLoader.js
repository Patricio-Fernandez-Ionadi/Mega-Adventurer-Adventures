import { Scene } from 'phaser'
import { SceneKeys } from '../utils/index.js'

// Screens
import menuBackground from '/src/assets/img/menu_bg.png'

// Character
import playerAtlas from '/src/assets/character/adventurer_atlas.json'
import playerAnims from '/src/assets/character/adventurer_anim.json'
import playerImage from '/src/assets/character/adventurer.png'

// Levels
import tilemap_level1 from '/src/assets/tilemaps/lvl1.json'
import level_1_tiles from '/src/assets/tilesets/maa_caves.png'

export class Bootloader extends Scene {
	preload() {
		// Menu
		this.load.image('menu-bg', menuBackground)

		// Levels
		this.load.image('level-1-tiles', level_1_tiles)
		this.load.tilemapTiledJSON('map1', tilemap_level1)

		// Character
		this.load.json('player_anim', playerAnims)
		this.load.atlas('adventurer', playerImage, playerAtlas)
	}

	create() {
		// prod
		// this.scene.start(SceneKeys.game.menu)
		// ------------------------------------------
		// dev
		this.scene.start(SceneKeys.game.world)
	}
}
