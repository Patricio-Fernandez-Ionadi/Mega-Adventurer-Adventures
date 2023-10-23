import { Player } from '../gameObjects/index.js'
import { ScreenSize } from '../utils/globals.js'

export class OverWorld extends Phaser.Scene {
	create() {
		// World
		this.physics.world.setBounds(0, 0, ScreenSize.width, ScreenSize.height)

		// Entities
		new Player(this, { x: 50, y: 150 })

		// Objects
		this.addFloor()

		// Collisions
		this.#handleCollisions()

		// Inputs
		this.#createKeyboardInputs()
	}

	update() {
		this.player.update()
	}

	addFloor() {
		this.floor = this.add
			.rectangle(0, ScreenSize.height - 50, ScreenSize.width, 50, 0xff0000, 1)
			.setOrigin(0)

		this.physics.add.existing(this.floor)
		this.floor.body.setCollideWorldBounds(true)
	}

	#handleCollisions() {
		this.physics.add.collider(this.floor.body, this.player.entity)
	}

	#createKeyboardInputs() {
		this.cursors = this.input.keyboard.createCursorKeys()

		this.cursors.Q = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.Q
		)
		this.cursors.W = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.W
		)
		this.cursors.E = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.E
		)
		this.cursors.TAB = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.TAB
		)
	}
}
