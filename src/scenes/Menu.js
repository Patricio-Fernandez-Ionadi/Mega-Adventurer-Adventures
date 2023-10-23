import { SceneKeys } from '../utils/index.js'

export class Menu extends Phaser.Scene {
	create() {
		const START = this.add.text(100, 100, 'Empezar Juego').setInteractive()

		START.on('pointerdown', () => {
			this.scene.stop()
			this.scene.run(SceneKeys.game.world)
		})
	}
}
