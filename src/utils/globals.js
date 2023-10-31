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
	speed: relative(7),
	strength: relative(12),
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

let auto16x9 = (size) => {
	return {
		width: size * 16,
		height: size * 9,
	}
}
const screenParam = 0.9
export const ScreenSize = {
	width: relative(auto16x9(screenParam).width),
	height: relative(auto16x9(screenParam).height),
}

export const SceneKeys = {
	load: 'bootload',
	game: {
		menu: 'menu',
		world: 'world',
	},
}
