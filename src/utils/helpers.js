/**
 * @param {number} size to be used in font
 *
 * returns an object with the font size setted ready to be used in texts
 *
 * @returns Object {fontSize: value}
 */
export const fz = (size) => ({ fontSize: size })

export const addPercent = (percent, value) => value * (1 + percent / 100)
export const subtractPercent = (percent, value) =>
	value - value * (percent / 100)
