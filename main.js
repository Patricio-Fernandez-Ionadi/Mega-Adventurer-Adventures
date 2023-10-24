import { GameInfo, SceneKeys, ScreenSize } from './src/utils/index.js'
import { Bootloader } from './src/load/index.js'
import { Menu, OverWorld } from './src/scenes/index.js'

const config = {
	type: Phaser.AUTO,
	fps: GameInfo.fps.middle,
	title: GameInfo.title,
	version: GameInfo.version,
	render: {
		transparent: false,
		clearBeforeRender: true,
	},
	physics: {
		walls: {
			left: true,
			right: true,
			top: true,
			bottom: true,
		},
		enabled: true,
		default: 'arcade',
		arcade: {
			gravity: GameInfo.physics.gravity,
			debug: true,
			// debug: false,
		},
	},
	banner: {
		hidePhaser: true,
		background: GameInfo.background,
	},
	plugins: null,
	width: ScreenSize.width,
	height: ScreenSize.height,
	pixelArt: true,
}
const game = new Phaser.Game(config)

game.scene.add(SceneKeys.load, Bootloader)
game.scene.add(SceneKeys.game.menu, Menu)
game.scene.add(SceneKeys.game.world, OverWorld)

game.scene.start(SceneKeys.load)
