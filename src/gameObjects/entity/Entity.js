export class Entity extends Phaser.GameObjects.Sprite {
	constructor(scene, pos) {
		super(scene, pos.x, pos.y)
		this.add = {
			sprite: (v) => this.#addSprite(v),
			animation: (v) => this.#addAnimation(v),
			bounding: () => this.#addBounding(),
			physics: (elem) => this.#addPhysics(elem),
			toScene: (name) => (this.scene[name] = this),
		}
		this.currentState = {
			name: '',
			whenIsSet: () => {},
			inputControl: (input) => {},
		}
	}

	update() {
		this.#updateEntity()
		this.#handleInputs()
		this.#handleAnimations()
	}

	setState(action) {
		this.currentState = this.states[action]
		this.currentState.whenIsSet()
	}

	createBounding(config) {
		const { name, position, x, y, width, height, size, color, alpha } = config

		let xToApply, yToApply, wToApply, hToApply

		if (position !== undefined) {
			xToApply = position.x
			yToApply = position.y
		} else {
			xToApply = x
			yToApply = y
		}

		if (size !== undefined) {
			if (typeof size === 'object') {
				wToApply = size.width
				hToApply = size.height
			} else {
				wToApply = size
				hToApply = size
			}
		} else {
			wToApply = width
			hToApply = height
		}

		if (name !== undefined) {
			this[name] = this.scene.add.rectangle(
				xToApply,
				yToApply,
				wToApply,
				hToApply,
				color ?? color,
				alpha ?? alpha
			)
		} else {
			this.scene.add.rectangle(
				xToApply,
				yToApply,
				wToApply,
				hToApply,
				color ?? color,
				alpha ?? alpha
			)
		}
	}

	#handleInputs() {
		this.currentState.inputControl(this.scene.cursors)
	}
	#handleAnimations() {
		if (this.animations[0]) {
			this.sprite.anims.play(this.currentState.name, true)
		}
	}

	#addSprite(sprite) {
		this.sprite = this.scene.add.sprite(this.x, this.y, sprite)
	}
	#addAnimation(anim) {
		this.animations = this.scene.anims.fromJSON(this.scene.cache.json.get(anim))
	}
	#addBounding() {
		this.entity = this.scene.add.rectangle(
			this.x,
			this.y,
			this.width,
			this.height,
			this.color ?? this.color,
			this.alpha ?? this.alpha
		)
	}
	#addPhysics(elem) {
		this.scene.physics.add.existing(elem)
		elem.body.setCollideWorldBounds(true)
	}

	#updateEntity() {
		// ------------
		if (this.scene.cursors.right.isDown) this.facing = false
		if (this.scene.cursors.left.isDown) this.facing = true
		this.sprite.setFlipX(this.facing)

		// ---------- WORK IN PROGRESS ----------
		console.log(this.speed)
		if (this.speed) {
			if (this.facing) {
				if (this.speed > 0) this.speed = -this.speed
			} else if (!this.facing) {
				if (this.speed < 0) this.speed = +this.speed
			}
		}
		// ---------- WORK IN PROGRESS ----------

		// ------------
		this.onfloor = this.entity.body.velocity.y === 0

		// ------------
		this.isJumping = !this.onfloor
	}
}
