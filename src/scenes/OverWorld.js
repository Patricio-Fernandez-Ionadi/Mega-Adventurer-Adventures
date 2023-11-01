import Phaser from 'phaser'
import { Player } from '../gameObjects/index.js'
import { ScreenSize, relative } from '../utils/globals.js'

class Level {
	constructor(scene) {
		this.scene = scene
		this.add = {
			map: (key) => this.#addMap(key),
			tileset: (name, image) => this.#addTileset(name, image),
			layer: (name, x, y) => this.#addLayer(name, x, y),
		}
	}

	#addMap(key) {
		this.map = this.scene.make.tilemap({ key })
	}
	#addTileset(name, tileImage) {
		this.tileset = this.map.addTilesetImage(name, tileImage)
	}

	#addLayer(name, x, y) {
		this[name] = this.map.createLayer(name, this.tileset, x, y)
	}
}

export class OverWorld extends Phaser.Scene {
	create() {
		// World
		this.physics.world.setBounds(0, 0, 960, ScreenSize.height)

		// Levels
		this.level = new Level(this)
		this.level.step = 1
		this.level.add.map('map')
		this.level.add.tileset('maa_caves_test', `level-${this.level.step}-tiles`)
		this.level.add.layer('platforms', 0, -182)
		this.level.platforms.setCollisionByExclusion(-1, true)

		// Entities
		new Player(this, { x: relative(5), y: relative(3) })

		// Cameras
		this.cameras.main.setBounds(0, 0, 960, ScreenSize.height)
		this.cameras.main.startFollow(this.player.entity, false, 0.5, 0.5)

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
