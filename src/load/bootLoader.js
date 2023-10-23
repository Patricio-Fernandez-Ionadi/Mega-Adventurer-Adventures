import Phaser from 'phaser'
import { SceneKeys } from '../utils/index.js'

import playerAtlas from '/src/assets/character/adventurer_atlas.json'
import playerAnims from '/src/assets/character/adventurer_anim.json'
import playerImage from '/src/assets/character/adventurer.png'

export class Bootloader extends Phaser.Scene {
	preload() {
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
