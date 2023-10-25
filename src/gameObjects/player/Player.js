import { addPercent, subtractPercent } from '../../utils/index.js'
import { Entity } from '../index.js'

/* ANIMACIONES FALTANTES

	weapon draw
	weapon shealth
	roll
	crouch

*/

const _P = {
	width: 32,
	height: 48,
	scale: 2,
	weight: 100,
	speed: 300,
	strength: 450,
	s: {
		idle: 'idle',
		run: 'run',
		walk: 'walk',
		sprint: 'sprint',
		jump: 'jump',
		fall: 'fall',
		slideloop: 'slideloop',
		slideend: 'slideend',
		dropkick: 'dropkick',
		atk1hand: 'atk1hand',
		atk2hand: 'atk2hand',
		atk3hand: 'atk3hand',
	},
}

export class Player extends Entity {
	constructor(scene, pos) {
		super(scene, pos)
		this.width = _P.width
		this.height = _P.height
		this.states = {
			idle: {
				name: _P.s.idle,
				whenIsSet: () => this.stop(),
				inputControl: (input) => {
					this.run(input)
					this.attack(input)
					if (input.up.isDown) this.setState(_P.s.jump)
				},
			},
			run: {
				name: _P.s.run,
				currentFacing: this.facing,
				whenIsSet: () => this.toggleSpeed(),
				inputControl: (input) => {
					let thisState = this.states.run

					this.stand(input)

					if (input.down.isDown) this.setState(_P.s.slideloop)
					else if (input.up.isDown) this.setState(_P.s.jump)
					this.attack(input)

					if (input.alt.isDown) this.setState(_P.s.walk)
					if (input.shift.isDown) this.setState(_P.s.sprint)

					this.toggleStateDirection(thisState)
				},
			},
			walk: {
				name: _P.s.walk,
				key: 'alt',
				currentFacing: this.facing,
				whenIsSet: () => this.slowDown(40),
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
				name: _P.s.sprint,
				key: 'shift',
				currentFacing: this.facing,
				whenIsSet: () => this.speedUp(100, this.speed),
				inputControl: (input) => {
					let thisState = this.states.sprint

					this.stand(input)

					if (input.shift.isUp) this.run(input)
					this.attack(input)

					this.toggleStateDirection(thisState)
				},
			},
			jump: {
				name: _P.s.jump,
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

					if (this.entity.body.velocity.y > 0) this.setState(_P.s.fall)
					else if (input.space.isDown && isMoving) this.setState(_P.s.dropkick)
				},
			},
			fall: {
				name: _P.s.fall,
				whenIsSet: () => {},
				inputControl: () => this.onfloor && this.setState(_P.s.idle),
			},
			slideloop: {
				name: 'slide-loop',
				whenIsSet: () => {
					this.entity.height = 20
					this.speedUp(30)
					this.delay(400, () => this.setState('slideend'))
				},
				inputControl: () => {},
			},
			slideend: {
				name: 'slide-end',
				whenIsSet: () => {
					this.slowDown(30)
					this.scene.time.delayedCall(200, () => {
						this.setState(_P.s.idle)
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
						this.setState(_P.s.idle)
					}
				},
			},
			atk1hand: {
				name: 'atk1-hand',
				whenIsSet: () => {
					this.stop()
					this.delay(800, () => this.setState(_P.s.idle))
				},
				inputControl: () => {},
			},
			atk2hand: {
				name: 'atk2-hand',
				whenIsSet: () => {
					this.stop()
					this.delay(600, () => this.setState(_P.s.idle))
				},
				inputControl: () => {},
			},
			atk3hand: {
				name: 'atk3-hand',
				whenIsSet: () => {
					this.stop()
					this.delay(600, () => this.setState(_P.s.idle))
				},
				inputControl: () => {},
			}
		}
		this.create()
	}
	create() {
		// player
		this.add.sprite('adventurer')
		this.add.animation('player_anim')
		this.add.bounding()
		this.add.physics(this.entity)

		// VALUES

		this.sprite.setScale(_P.scale)
		this.weight = _P.weight
		this.strength = _P.strength
		this.speed = _P.speed
		this.holdingWeapon = false

		// -------------------

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
		// -------------------

		// -------------------
		// STATE
		if (!this.onfloor) this.setState(_P.s.fall)
		else this.setState(_P.s.idle)

		// -------------------
		this.add.toScene('player')
	}
	update() {
		super.update()

		// Object values
		this.#updateSprite()
		this.#updateHitArea()
	}

	// Helpers
	stop() {
		this.entity.body.setVelocityX(0)
	}
	speedUp(percent) {
		if (this.entity.body.velocity.x !== 0) {
			this.entity.body.setVelocityX(
				addPercent(percent, this.entity.body.velocity.x)
			)
		} else {
			this.entity.body.setVelocityX(addPercent(percent, this.speed))
		}
	}
	slowDown(percent) {
		if (this.entity.body.velocity.x !== 0) {
			this.entity.body.setVelocityX(
				subtractPercent(percent, this.entity.body.velocity.x)
			)
		} else {
			this.entity.body.setVelocityX(subtractPercent(percent, this.speed))
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
			this.setState(state.name)

			state.currentFacing = this.facing
		}
	}
	stand(input) {
		if (input.right.isUp && input.left.isUp) this.setState(_P.s.idle)
	}
	run(input) {
		if (input.right.isDown || input.left.isDown) {
			this.setState(_P.s.run)
		}
	}
	attack(input) {
		if (input.q.isDown) this.setState(_P.s.atk1hand)
		else if (input.w.isDown) this.setState(_P.s.atk2hand)
		else if (input.e.isDown) this.setState(_P.s.atk3hand)
	}

	reset(prop) {
		if (_P[prop]) this[prop] = _P[prop]
   else throw new Error(
`${prop} no es un valor del objeto _P`)
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
		this.sprite.y = this.entity.y - 12
	}
}
