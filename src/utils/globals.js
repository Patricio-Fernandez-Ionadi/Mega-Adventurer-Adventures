import { relative } from './helpers.js'

export const tileSize = 16
export const GameInfo = {
	version: '0.0.1',
	title: 'Mega Adventurer Adventures',
	link: '',
	fps: {
		light: 30,
		middle: 50,
		standard: 60,
		ultra: 100,
	},
	background: '#000',
	tileSize,
	physics: {
		gravity: { y: relative(20), x: 0 },
	},
}

export const PlayerBase = {
	width: GameInfo.tileSize,
	height: GameInfo.tileSize,
	speed: relative(7),
	strength: relative(15),
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

export const ScreenSize = {
	width: 800,
	height: 480,
}

export const SceneKeys = {
	load: 'bootload',
	game: {
		menu: 'menu',
		world: 'world',
	},
}

export const Levels = {
	lvl_1: {
		width: 960,
		height: 480,
		tileset: 'caves_tileset',
		layers: {
			floor: 'floor',
			collision: 'collision',
		},
	},
}
