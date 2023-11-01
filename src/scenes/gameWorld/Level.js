export class Level {
	constructor(scene, currentLevel) {
		this.scene = scene
		this.current = currentLevel
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
