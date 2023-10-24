import { Entity } from '../index.js'

export class Player extends Entity {
	constructor(scene, pos) {
		super(scene, pos)
		this.width = 32
		this.height = 48

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
					if (this.onfloor) this.setState('idle')
				},
			},
			// : { name: '' },
		}

		this.create()
	}
	create() {
		// player
		this.add.sprite('adventurer')
		this.add.animation('player_anim')
		this.add.bounding()
		this.add.physics(this.entity)

		// Hit area
		this.hitarea = {
			name: 'hitArea',
			x: this.x + this.entity.width,
			y: this.y,
			size: 32,
			// color: 0xffffff,
		}
		this.createBounding(this.hitarea)
		// -------------------

		// VALUES
		this.sprite.setScale(2)
		this.weight = 100
		this.streght = 450
		this.speed = 300
		// -------------------
		// -------------------

		// -------------------
		// STATE
		if (!this.onfloor) this.setState('fall')
		else this.setState('idle')

		// -------------------
		this.add.toScene('player')
	}
	update() {
		super.update()
		// Object values
		this.#updateSprite()
		this.#updateHitArea()
	}

	// Control

	// Updates
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
}
