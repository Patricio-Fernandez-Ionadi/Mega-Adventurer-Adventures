import * as c from '../../utils/index.js'
import { Entity } from '../index.js'

/* ANIMACIONES FALTANTES

	weapon draw
	weapon shealth
	roll
	crouch

*/

export class Player extends Entity {
	constructor(scene, pos) {
		super(scene, pos)
		this.width = c.PlayerBase.width * 2
		this.height = c.PlayerBase.height * 2
		this.states = {
			idle: {
				name: c.PlayerBase.s.idle,
				whenIsSet: () => this.stop(),
				inputControl: (input) => {
					this.run(input)
					this.attack(input)
					if (input.up.isDown) this.state.setState(c.PlayerBase.s.jump)
				},
			},
			run: {
				name: c.PlayerBase.s.run,
				currentFacing: this.facing,
				whenIsSet: () => this.toggleSpeed(),
				inputControl: (input) => {
					let thisState = this.states.run

					this.stand(input)

					if (input.down.isDown) this.state.setState(c.PlayerBase.s.slideloop)
					else if (input.up.isDown) this.state.setState(c.PlayerBase.s.jump)
					this.attack(input)

					if (input.alt.isDown) this.state.setState(c.PlayerBase.s.walk)
					if (input.shift.isDown) this.state.setState(c.PlayerBase.s.sprint)

					this.toggleStateDirection(thisState)
				},
			},
			walk: {
				name: c.PlayerBase.s.walk,
				key: 'alt',
				currentFacing: this.facing,
				whenIsSet: () => this.slowDown(50),
				inputControl: (input) => {
					let thisState = this.states.walk

					this.stand(input)
					this.attack(input)

					// change state action
					if (input.alt.isUp) {
						this.run(input)
					}

					this.toggleStateDirection(thisState)
				},
			},
			sprint: {
				name: c.PlayerBase.s.sprint,
				key: 'shift',
				currentFacing: this.facing,
				whenIsSet: () => this.speedUp(70, this.speed),
				inputControl: (input) => {
					let thisState = this.states.sprint

					this.stand(input)

					if (input.shift.isUp) this.run(input)
					this.attack(input)

					this.toggleStateDirection(thisState)
				},
			},
			jump: {
				name: c.PlayerBase.s.jump,
				whenIsSet: () => {
					let speedWhenJump = this.entity.body.velocity.x * 0.8

					this.stop()
					this.delay(300, () => {
						this.entity.body.setVelocityX(speedWhenJump)
						this.entity.body.setVelocityY(-this.strength)
					})
				},
				inputControl: (input) => {
					let isMoving = Math.abs(this.entity.body.velocity.x) > 0

					if (this.entity.body.velocity.y > 0)
						this.state.setState(c.PlayerBase.s.fall)
					else if (input.space.isDown && isMoving)
						this.state.setState(c.PlayerBase.s.dropkick)
				},
			},
			fall: {
				name: c.PlayerBase.s.fall,
				whenIsSet: () => {},
				inputControl: () =>
					this.onfloor && this.state.setState(c.PlayerBase.s.idle),
			},
			slideloop: {
				name: 'slide-loop',
				whenIsSet: () => {
					this.entity.height = 20
					this.speedUp(30)
					this.delay(400, () => this.state.setState('slideend'))
				},
				inputControl: () => {},
			},
			slideend: {
				name: 'slide-end',
				whenIsSet: () => {
					this.slowDown(30)
					this.scene.time.delayedCall(200, () => {
						this.state.setState(c.PlayerBase.s.idle)
					})
				},
				inputControl: () => {},
			},
			dropkick: {
				name: 'drop-kick',
				whenIsSet: () => {
					this.speedUp(80)
					this.weight *= 2
				},
				inputControl: () => {
					if (this.onfloor) {
						this.reset('weight')
						this.state.setState(c.PlayerBase.s.idle)
					}
				},
			},
			atk1hand: {
				name: 'atk1-hand',
				whenIsSet: () => {
					this.stop()
					this.delay(800, () => this.state.setState(c.PlayerBase.s.idle))
				},
				inputControl: () => {},
			},
			atk2hand: {
				name: 'atk2-hand',
				whenIsSet: () => {
					this.stop()
					this.delay(600, () => this.state.setState(c.PlayerBase.s.idle))
				},
				inputControl: () => {},
			},
			atk3hand: {
				name: 'atk3-hand',
				whenIsSet: () => {
					this.stop()
					this.delay(600, () => this.state.setState(c.PlayerBase.s.idle))
				},
				inputControl: () => {},
			},
		}
		this.create()
	}
	create() {
		// player
		this.add.sprite('adventurer', { x: 20, y: 8 })
		this.add.animation('player_anim')
		this.add.bounding()
		this.add.physics(this.entity)

		// VALUES

		this.sprite.setScale(c.PlayerBase.scale)
		this.weight = c.PlayerBase.weight
		this.strength = c.PlayerBase.strength
		this.speed = c.PlayerBase.speed
		this.holdingWeapon = false

		// -------------------

		// Hit area
		this.hitarea = {
			name: 'hitArea',
			x: this.x,
			y: this.y,
			size: this.width,
			// color: 0xffffff,
		}
		this.createBounding(this.hitarea)
		// -------------------
		// -------------------

		// -------------------
		// STATE
		if (!this.onfloor) this.state.setState(c.PlayerBase.s.fall)
		else this.state.setState(c.PlayerBase.s.idle)

		// -------------------
		this.add.toScene('player')
	}
	update() {
		super.update()

		// Object values
		this.#updateSprite()
		this.#updateHitArea()
		this.check_slowInJump()
	}

	// Helpers
	stop() {
		this.entity.body.setVelocityX(0)
	}
	speedUp(percent) {
		if (this.entity.body.velocity.x !== 0) {
			this.entity.body.setVelocityX(
				c.addPercent(percent, this.entity.body.velocity.x)
			)
		} else {
			this.entity.body.setVelocityX(c.addPercent(percent, this.speed))
		}
	}
	slowDown(percent) {
		if (this.entity.body.velocity.x !== 0) {
			this.entity.body.setVelocityX(
				c.subtractPercent(percent, this.entity.body.velocity.x)
			)
		} else {
			this.entity.body.setVelocityX(c.subtractPercent(percent, this.speed))
		}
	}
	delay(time, cb) {
		this.scene.time.delayedCall(time, cb)
	}
	toggleSpeed() {
		if (this.facing) {
			this.entity.body.setVelocityX(-this.speed)
		}
		if (!this.facing) {
			this.entity.body.setVelocityX(this.speed)
		}
	}
	toggleStateDirection(state) {
		/**
		 * esta condicion checkea que si por algun motivo el jugador tiene ambas direcciones presionadas, cuando una de esas direcciones este levantada y la otra permanezca apretada el jugador tome la direccion que corresponde
		 *
		 * para esto usa un valor 'currentFacing' que por defecto es false y chequea que sea igual al valor facing de la entidad, si son iguales la direccion no ha cambiado, pero si son diferentes el jugador debe tomar otra direccion
		 *
		 * finalmente se vuelve a setear el estado para que el metodo 'whenIsSet' sea llamado y aplique los cambios necesarios en este caso modificar la velocidad base
		 */
		if (state.currentFacing !== this.facing) {
			this.toggleSpeed()
			this.state.setState(state.name)

			state.currentFacing = this.facing
		}
	}
	stand(input) {
		if (input.right.isUp && input.left.isUp)
			this.state.setState(c.PlayerBase.s.idle)
	}
	run(input) {
		if (input.right.isDown || input.left.isDown) {
			this.state.setState(c.PlayerBase.s.run)
		}
	}
	attack(input) {
		if (input.q.isDown) this.state.setState(c.PlayerBase.s.atk1hand)
		else if (input.w.isDown) this.state.setState(c.PlayerBase.s.atk2hand)
		else if (input.e.isDown) this.state.setState(c.PlayerBase.s.atk3hand)
	}
	check_slowInJump() {
		if (!this.onfloor) {
			if (this.entity.body.velocity.x > 0 && this.scene.cursors.left.isDown)
				this.entity.body.velocity.x -= 10
			else if (
				this.entity.body.velocity.x < 0 &&
				this.scene.cursors.right.isDown
			)
				this.entity.body.velocity.x += 10
		}
	}

	reset(prop) {
		if (_P[prop]) {
			this[prop] = _P[prop]
		} else {
			console.error(`${prop} no es un valor del objeto _P`)
		}
	}

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
		this.sprite.y = this.entity.y - this.sprite.padding.y + 2
	}
}
