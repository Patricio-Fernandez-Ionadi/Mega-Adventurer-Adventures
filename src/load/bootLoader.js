import { Scene } from 'phaser'
import { SceneKeys } from '../utils/index.js'

// Screens
import menuBackground from '/src/assets/img/menu_bg.png'

// Character
import playerAtlas from '/src/assets/character/adventurer_atlas.json'
import playerAnims from '/src/assets/character/adventurer_anim.json'
import playerImage from '/src/assets/character/adventurer.png'

// Levels
import tilemap_level1 from '/src/assets/tiles/tile_level_1_map.json'
import level_1_background from '/src/assets/tiles/level_1_map.png'

export class Bootloader extends Scene {
	preload() {
		// Menu
		this.load.image('menu-bg', menuBackground)

		// Levels
		this.load.image('level-1-bg', level_1_background)
		this.load.tilemapTiledJSON('level1', tilemap_level1)

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
