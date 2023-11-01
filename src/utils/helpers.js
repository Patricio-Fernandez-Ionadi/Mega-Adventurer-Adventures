import { tileSize } from './globals.js'

/** fz()
 * @param {number} size
 *
 * devuelve un objeto con el valor de fontSize que puede ser usado al añadir texto en una escena
 *
 * @returns Object {fontSize: value}
 */
export const fz = (size) => ({ fontSize: size })

/** addPercent() // <-> // subtractPercen()
 *
 * @param {number} percent valor en porcentaje (0 - 100)
 * @param {number} value valor sobre el cual aplicar el porcentaje
 *
 * Dado un porcentaje y el numero sobre el cual trabajar, retorna la adicion o sustraccion del valor correspondiente
 *
 * ej: addPercent(20, 100) -> 120
 * ej: subtractPercent(20, 100) -> 80
 *
 * @returns number
 */
export const addPercent = (percent, value) => value * (1 + percent / 100)
export const subtractPercent = (percent, value) =>
	value - value * (percent / 100)

/** relative()
 * @param {number} value
 * toma un valor que representa el numero de tiles que desean ser evaluadas. Multiplicando el input por el tamaño de tiles retorna la posicion/tamaño en pixeles que deberia ser considerado.
 * @returns number
 */
export function relative(value) {
	return tileSize * value
}
