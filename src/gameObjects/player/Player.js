import Phaser from 'phaser'

export class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, pos) {
		super(scene, pos.x, pos.y, 'adventurer')
		this.scene = scene

		this.weight = 100
		this.streght = 450
		this.speed = 300

		this.states = {
			idle: {
				name: 'idle',
				whenIsSet: () => {
					this.entity.body.setVelocityX(0)
				},
				inputControl: (input) => {
					if (input.right.isDown || input.left.isDown) {
						this.setState('run')
					} else if (input.up.isDown) this.setState('jump')
				},
			},
			walk: {
				name: 'walk',
				whenIsSet: () => {},
				inputControl: (input) => {},
			},
			run: {
				name: 'run',
				whenIsSet: () => {
					if (this.facing) {
						this.entity.body.setVelocityX(-this.speed)
					} else if (!this.facing) {
						this.entity.body.setVelocityX(this.speed)
					}
				},
				inputControl: (input) => {
					if (input.right.isUp && input.left.isUp) {
						this.setState('idle')
					} else if (input.up.isDown) this.setState('jump')
					else if (input.right.isDown) this.setState('run')
					else if (input.left.isDown) this.setState('run')
				},
			},
			sprint: {
				name: 'sprint',
				whenIsSet: () => {},
				inputControl: (input) => {},
			},
			jump: {
				name: 'jump',
				whenIsSet: () => {
					let speedWhenJump = this.entity.body.velocity.x

					this.entity.body.setVelocityX(0)
					this.scene.time.delayedCall(300, () => {
						this.entity.body.setVelocityX(speedWhenJump * 0.8)
						this.entity.body.setVelocityY(-this.streght)
					})
				},
				inputControl: (input) => {
					if (this.entity.body.velocity.y > 0) this.setState('fall')
				},
			},
			fall: {
				name: 'fall',
				whenIsSet: () => {},
				inputControl: (input) => {
					if (this.#onFloor()) this.setState('idle')
				},
			},
			// : { name: '' },
		}
		this.currentState = this.states.idle

		this.create()
	}
	create() {
		// -------------------
		// SPRITE
		this.sprite = this.scene.add.sprite(this.x, this.y, 'adventurer')
		// Animations
		this.animations = this.scene.anims.fromJSON(
			this.scene.cache.json.get('player_anim')
		)
		// -------------------
		// -------------------

		// -------------------
		// PHYSICS
		this.#createPhysicEntity({
			name: 'entity',
			pos: {
				x: this.x,
				y: this.y,
			},
			size: {
				w: 32,
				h: 48,
			},
		})
		this.hitarea = {
			name: 'hitArea',
			pos: {
				x: this.x + this.entity.width,
				y: this.y,
			},
			size: {
				w: 32,
				h: 32,
			},
			color: 0xffffff,
		}
		this.#createBounding(this.hitarea)
		// -------------------
		// -------------------

		// -------------------
		// VALUES
		this.sprite.setScale(2)
		// -------------------
		// -------------------

		// -------------------
		// create in scene
		this.scene.player = this
		// -------------------
	}
	update() {
		// Object values
		this.#handleFacing()
		this.#updateSprite()
		this.#updateHitArea()

		// States
		this.#handleInputs()
		this.#handleAnimations()
	}

	setState(action) {
		this.currentState = this.states[action]
		this.currentState.whenIsSet()
	}

	// Control
	#handleFacing() {
		if (this.scene.cursors.right.isDown) {
			this.facing = false
		} else if (this.scene.cursors.left.isDown) {
			this.facing = true
		}
		this.sprite.setFlipX(this.facing)
	}

	// Utils
	#onFloor() {
		return this.entity.body.velocity.y === 0
	}

	#createBounding({ name, pos, size, color, alpha }) {
		if (typeof size === 'number') {
			this[name] = this.scene.add.rectangle(
				pos.x,
				pos.y,
				size,
				size,
				color ?? color,
				alpha ?? alpha
			)
		} else if (typeof size === 'object') {
			this[name] = this.scene.add.rectangle(
				pos.x,
				pos.y,
				size.w,
				size.h,
				color ?? color,
				alpha ?? alpha
			)
		}
	}
	#createPhysicEntity(entity) {
		this.#createBounding(entity)

		this.scene.physics.add.existing(this[entity.name])
	}

	#updateHitArea() {
		if (this.facing) {
			this.hitArea.x = this.entity.x - this.entity.width
		} else if (!this.facing) {
			this.hitArea.x = this.entity.x + this.entity.width
		}

		this.hitArea.y = this.entity.y - 12
	}
	#updateSprite() {
		this.sprite.x = this.entity.x
		this.sprite.y = this.entity.y - 12
	}
	#handleInputs() {
		this.currentState.inputControl(this.scene.cursors)
	}
	#handleAnimations() {
		this.sprite.anims.play(this.currentState.name, true)
	}
}
