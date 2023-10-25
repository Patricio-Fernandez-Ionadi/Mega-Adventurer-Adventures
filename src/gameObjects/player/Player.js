import { Entity } from '../index.js'

function addPercent(percent, value) {
	return value * (1 + percent / 100)
}
function subtractPercent(percent, value) {
	return value - value * (percent / 100)
}

/* ANIMACIONES FALTANTES

	weapon draw
	weapon shealth
	roll
	crouch

*/

export class Player extends Entity {
	constructor(scene, pos) {
		super(scene, pos)
		this.width = 32
		this.height = 48
		this.states = {
			idle: {
				name: 'idle',
				whenIsSet: () => this.stop(),
				inputControl: (input) => {
					this.run(input)
					this.attack(input)
					if (input.up.isDown) this.setState('jump')
				},
			},
			walk: {
				name: 'walk',
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
			run: {
				name: 'run',
				currentFacing: this.facing,
				whenIsSet: () => this.toggleSpeed(),
				inputControl: (input) => {
					let thisState = this.states.run

					this.stand(input)

					if (input.down.isDown) this.setState('slideloop')
					else if (input.up.isDown) this.setState('jump')
					this.attack(input)

					if (input.alt.isDown) this.setState('walk')
					if (input.shift.isDown) this.setState('sprint')

					this.toggleStateDirection(thisState)
				},
			},
			sprint: {
				name: 'sprint',
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
				name: 'jump',
				whenIsSet: () => {
					let speedWhenJump = this.entity.body.velocity.x * 0.8

					this.stop()
					this.delay(300, () => {
						this.entity.body.setVelocityX(speedWhenJump)
						this.entity.body.setVelocityY(-this.streght)
					})
				},
				inputControl: (input) => {
					if (this.entity.body.velocity.y > 0) this.setState('fall')
					else if (input.space.isDown) this.setState('dropkick')
				},
			},
			fall: {
				name: 'fall',
				whenIsSet: () => {},
				inputControl: () => {
					if (this.onfloor) this.setState('idle')
				},
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
						this.setState('idle')
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
						this.resetWeight()
						this.setState('idle')
					}
				},
			},
			atk1hand: {
				name: 'atk1-hand',
				combo: false,

				whenIsSet: () => {
					this.stop()

					this.delay(600, () => {
						this.states.atk1hand.combo = true
					})
					this.delay(800, () => {
						this.setState('idle')
						this.states.atk1hand.combo = false
					})
				},
				inputControl: (input) => {
					if (this.states.atk1hand.combo) {
						if (input.w.isDown) this.setState('atk2hand')
						return
					}
				},
			},
			atk2hand: {
				name: 'atk2-hand',
				combo: false,

				whenIsSet: () => {
					this.stop()

					this.delay(200, () => {
						this.states.atk2hand.combo = true
					})
					this.delay(600, () => {
						this.setState('idle')
						this.states.atk2hand.combo = false
					})
				},
				inputControl: (input) => {
					if (this.states.atk2hand.combo) {
						if (input.e.isDown) this.setState('atk3hand')
					}
				},
			},
			atk3hand: {
				name: 'atk3-hand',
				combo: false,

				whenIsSet: () => {
					this.stop()

					this.delay(200, () => {
						this.states.atk3hand.combo = true
					})
					this.delay(600, () => {
						this.setState('idle')
						this.states.atk3hand.combo = false
					})
				},
				inputControl: (input) => {
					// if (this.states.atk3hand.combo) {
					// 	if (input.q.isDown) this.setState('atk3hand')
					// }
				},
			},
			// : {
			// name: '',
			// whenIsSet: () => {},
			// inputControl: (input) => {}
			// },
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

		this.sprite.setScale(2)
		this.weight = 100
		this.streght = 450
		this.speed = 300
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
		if (input.right.isUp && input.left.isUp) this.setState('idle')
	}
	run(input) {
		if (input.right.isDown || input.left.isDown) {
			this.setState('run')
		}
	}
	attack(input) {
		if (input.q.isDown) this.setState('atk1hand')
		else if (input.w.isDown) this.setState('atk2hand')
		else if (input.e.isDown) this.setState('atk3hand')
	}

	// TODO: crear objeto para reset general
	resetWeight() {
		this.weight = 100
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
