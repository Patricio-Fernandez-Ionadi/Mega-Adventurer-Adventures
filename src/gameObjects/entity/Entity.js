export class Entity extends Phaser.GameObjects.Sprite {
	constructor(scene, pos) {
		super(scene, pos.x, pos.y)
		this.add = {
			sprite: (v, pad) => this.#addSprite(v, pad),
			animation: (v) => this.#addAnimation(v),
			bounding: () => this.#addBounding(),
			physics: (elem) => this.#addPhysics(elem),
			toScene: (name) => (this.scene[name] = this),
		}
		this.state = {
			current: {
				name: '',
				whenIsSet: () => {},
				inputControl: (input) => {},
			},
			setState: (state) => this.#setState(state),
		}
		this.facing = false
		this.speed = 0
	}

	update() {
		this.#updateEntity()
		this.#handleInputs()
		this.#handleAnimations()
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

	// Sprite
	#addSprite(sprite, padding) {
		this.sprite = this.scene.add.sprite(this.x, this.y, sprite)

		this.sprite.padding = {
			x: padding !== undefined ? padding.x : 0,
			y: padding !== undefined ? padding.y : 0,
		}
	}
	// Box
	#addBounding() {
		this.entity = this.scene.add.rectangle(
			this.x,
			this.y,
			this.width - this.sprite.padding.x,
			this.height - this.sprite.padding.y,
			this.color ?? this.color,
			this.alpha ?? this.alpha
		)
	}
	// State
	#setState(action) {
		this.state.current = this.states[action]
		this.state.current.whenIsSet()
	}
	// Keyboard
	#handleInputs() {
		this.state.current.inputControl(this.scene.cursors)
	}
	// Animations
	#addAnimation(anim) {
		this.animations = this.scene.anims.fromJSON(this.scene.cache.json.get(anim))
	}
	#handleAnimations() {
		if (this.animations[0]) {
			this.sprite.anims.play(this.state.current.name, true)
		}
	}
	// Physics
	#addPhysics(elem) {
		this.scene.physics.add.existing(elem)
		elem.body.setCollideWorldBounds(true)
	}
	#updateEntity() {
		// ------------
		this.#handleFacingInputs()

		// ------------
		this.onfloor = this.entity.body.velocity.y === 0

		// ------------
		this.isJumping = !this.onfloor
	}
	// Orientation handler
	#handleFacingInputs() {
		const right = this.scene.cursors.right
		const left = this.scene.cursors.left

		if (right.isDown && left.isUp) this.facing = false
		if (left.isDown && right.isUp) this.facing = true
		this.sprite.setFlipX(this.facing)
	}
}
