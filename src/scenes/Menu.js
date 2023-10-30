import Phaser from 'phaser'
import { SceneKeys, ScreenSize, fz } from '../utils/index.js'

import * as Glob from '../utils'

export class Menu extends Phaser.Scene {
	preload() {}

	create() {
		this.#createBackground({
			image: 'menu-bg',
			origins: { y: 0.45 },
			scale: 3,
		})
		this.#createTitle()

		this.#menuInterface()
	}

	// Menu Interface
	#menuInterface() {
		const menuMinX = 100,
			menuMinY = 160,
			menuWidth = ScreenSize.width - menuMinX * 2,
			menuHeight = 150,
			menuColor = 0x000000,
			menuFontSize = 24

		this.menuUI = this.add.rectangle(
			menuMinX,
			menuMinY,
			menuWidth,
			menuHeight,
			menuColor
		)
		this.menuUI.setOrigin(0).setAlpha(0.4)

		const menuListItem = { x: menuWidth / 2 }

		const START = {
			x: menuMinX + menuListItem.x - 100,
			y: menuMinY + 20,
			name: 'start',
			label: 'Empezar Juego',
			fontSize: menuFontSize,
		}
		this.#createButton(START)

		const OPTIONS = {
			x: menuMinX + menuListItem.x - 65,
			y: menuMinY + 50,
			name: 'options',
			label: 'Opciones',
			fontSize: menuFontSize,
		}
		this.#createButton(OPTIONS)

		this.#hoverAnimationText(this.start)
		this.#hoverAnimationText(this.options)

		this.#onClick(this.start, () => this.#runScene(Glob.SceneKeys.game.world))
		this.#onClick(this.options, () => {
			// TODO -> this.#runScene(Glob.SceneKeys.game.options)
		})
	}

	// Extracts
	#createBackground({ image, origins, scale }) {
		this.menuBackground = this.add.image(0, 0, image)

		if (origins !== undefined) {
			if (origins === 'object') {
				this.menuBackground.setOrigin(origins.x, origins.y)
			} else if (origins === 'number') {
				this.menuBackground.setOrigin(origins, origins)
			}
		}

		if (scale !== undefined) {
			this.menuBackground.setScale(scale)
		}
	}
	#createTitle() {
		this.add.text(60, 20, 'Mega', fz(48))
		this.add.text(80, 65, 'Adventures', fz(48))
		this.add.text(20, 105, 'Adventurer', fz(48))
	}

	// Utils
	#createButton(btn) {
		this[btn.name] = this.add
			.text(btn.x || 0, btn.y || 0, btn.label, fz(btn.fontSize))
			.setInteractive()
			.setOrigin(0)
	}
	#runScene(scene) {
		this.scene.stop()
		this.scene.run(scene)
	}

	// Mouse events
	#hoverAnimationText(elem) {
		elem.on('pointerover', (e) => {
			elem.setScale(1.1)
			elem.x = elem.x - 2
			elem.y = elem.y - 1
		})
		elem.on('pointerout', (e) => {
			elem.setScale(1)
			elem.x = elem.x + 2
			elem.y = elem.y + 1
		})
	}
	#onClick(elem, cb) {
		if (typeof cb === 'function') {
			elem.on('pointerdown', (e) => cb(e))
		}
	}
}
