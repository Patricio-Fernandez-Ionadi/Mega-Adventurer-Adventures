import { Player } from '../gameObjects/index.js'
import { ScreenSize, relative } from '../utils/globals.js'

// 5121 collision code
export class OverWorld extends Phaser.Scene {
	create() {
		// World
		this.physics.world.setBounds(0, 0, ScreenSize.width, ScreenSize.height)

		// Background
		this.level = {}
		this.level.background = this.add.image(
			0,
			ScreenSize.height / 2,
			'level-1-bg'
		)
		this.level.background.setOrigin(0, 0.85)

		// Entities
		new Player(this, { x: relative(5), y: relative(10) })

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
			.rectangle(
				0,
				ScreenSize.height - relative(3),
				ScreenSize.width,
				relative(3) // 0xff0000, 1
			)
			.setOrigin(0)

		this.physics.add.existing(this.floor)
		this.floor.body.setCollideWorldBounds(true)
	}

	#handleCollisions() {
		this.physics.add.collider(this.floor.body, this.player.entity)
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
