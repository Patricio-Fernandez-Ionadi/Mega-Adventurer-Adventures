import { GameInfo, SceneKeys, ScreenSize } from './src/utils/index.js'
import { Bootloader } from './src/load/index.js'
import { Menu, OverWorld } from './src/scenes/index.js'

const config = {
	banner: {
		background: GameInfo.background,
		hidePhaser: true,
	},
	fps: GameInfo.fps.middle,
	height: ScreenSize.height,
	physics: {
		arcade: {
			debug: false,
			// debug: true,
			gravity: GameInfo.physics.gravity,
		},
		default: 'arcade',
		enabled: true,
		walls: {
			bottom: true,
			left: true,
			right: true,
			top: true,
		},
	},
	pixelArt: true,
	plugins: null,
	render: {
		clearBeforeRender: true,
		transparent: false,
	},
	title: GameInfo.title,
	type: Phaser.AUTO,
	url: GameInfo.link,
	version: GameInfo.version,
	width: ScreenSize.width,
}
const game = new Phaser.Game(config)

game.scene.add(SceneKeys.load, Bootloader)
game.scene.add(SceneKeys.game.menu, Menu)
game.scene.add(SceneKeys.game.world, OverWorld)
// game.scale.setZoom(4)

game.scene.start(SceneKeys.load)
