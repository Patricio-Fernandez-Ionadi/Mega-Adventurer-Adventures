import Phaser from 'phaser'
import { Player } from '../gameObjects/index.js'
import { ScreenSize, relative } from '../utils/globals.js'

// 5121 collision code
export class OverWorld extends Phaser.Scene {
	create() {
		// World
		this.physics.world.setBounds(0, 0, ScreenSize.width, ScreenSize.height)

		// Levels
		this.level = {}
		this.level.map = this.make.tilemap({ key: 'map' })
		this.level.tileset = this.level.map.addTilesetImage(
			'maa_caves_test',
			'level-1-tiles'
		)
		this.level.platforms = this.level.map.createLayer(
			'platforms',
			this.level.tileset,
			0,
			-182
		)
		// console.log(this.level)
		// this.physics.add.existing(this.level)
		this.level.platforms.setCollisionByExclusion(-1, true)

		// Entities
		new Player(this, { x: relative(5), y: relative(3) })

		// Objects
		// this.addFloor()

		// Collisions
		this.#handleCollisions()

		// Inputs
		this.#createKeyboardInputs()
	}

	update() {
		this.player.update()
	}

	addFloor() {
		this.floor = this.add.rectangle(
			0,
			ScreenSize.height - relative(3),
			ScreenSize.width,
			relative(3)
			// 0xff0000, 1
		)

		this.floor.setOrigin(0)

		this.physics.add.existing(this.floor)
		this.floor.body.setCollideWorldBounds(true)
	}

	#handleCollisions() {
		this.physics.add.collider(this.player.entity, this.level.platforms)
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
