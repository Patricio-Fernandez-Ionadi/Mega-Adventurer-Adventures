import Phaser from 'phaser'
// Globals
import { ScreenSize, relative } from '../../utils/index.js'
// Enities
import { Player } from '../../gameObjects/index.js'
// Classes
import { Level } from './Level.js'

export class OverWorld extends Phaser.Scene {
	create() {
		// World
		this.physics.world.setBounds(0, 0, 960, 480)

		// Entities
		new Player(this, { x: relative(5), y: relative(24) })

		// Level
		this.level = new Level(this, this.player.level)
		this.level.add.map('map1')
		this.level.add.tileset('caves_tileset', `level-${this.level.current}-tiles`)
		this.level.add.layer('floor', 0, 0)
		this.level.add.layer('collision', 0, 0, false)
		this.level.collision.setCollisionByExclusion(-1, true)

		// Cameras
		this.cameras.main.setBounds(0, 0, 960, 480)
		this.cameras.main.startFollow(this.player.entity)
		this.cameras.main.setFollowOffset(0, 0)

		// Collisions
		this.#handleCollisions()

		// Inputs
		this.#createKeyboardInputs()
	}

	update() {
		this.player.update()
	}

	#handleCollisions() {
		this.physics.add.collider(this.player.entity, this.level.collision)
	}

	#createKeyboardInputs() {
		this.cursors = this.input.keyboard.createCursorKeys()

		this.cursors = {
			...this.cursors,
			q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
			w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
			tab: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB),
			space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
			shift: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
			alt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT),
		}
	}
}
