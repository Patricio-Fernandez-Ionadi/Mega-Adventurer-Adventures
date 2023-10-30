export const tileSize = 16

export function relative(value) {
	return tileSize * value
}

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
	tileSize: tileSize,
	physics: {
		gravity: { y: relative(20), x: 0 },
	},
}

export const PlayerBase = {
	width: GameInfo.tileSize,
	height: GameInfo.tileSize,
	scale: 1,
	weight: relative(3),
	speed: relative(8),
	strength: relative(18),
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
	width: relative(29),
	height: relative(18),
}

export const SceneKeys = {
	load: 'bootload',
	game: {
		menu: 'menu',
		world: 'world',
	},
}
