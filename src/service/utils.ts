export function decAdjust(type: `floor` | `round` | `ceil`, value: number, exp: number = 0): number {
	if (exp === 0) {
		return Math.round(value);
	}
	value = +value;
	exp = +exp;
	if (isNaN(value) || !(exp % 1 === 0)) {
		return NaN;
	}
	let strValue = value.toString().split('e');
	value = Math[type](+(strValue[0] + 'e' + (strValue[1] ? (+strValue[1] - exp) : -exp)));
	// Обратный сдвиг
	strValue = value.toString().split('e');
	return +(strValue[0] + 'e' + (strValue[1] ? (+strValue[1] + exp) : exp));
}