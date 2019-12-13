export const fixUndefined = (formatter: number, ...args: (string | number | undefined)[]): string => {
	if (args.includes(undefined)) {
		return `\u00A0`;
	}
	const argsFormatted = args.map(arg => typeof arg === `number` ? arg.toFixed(formatter) : arg);
	return [...argsFormatted].join(``);
};

export const createEmptyGridPart = (depth: number) => {
	const output = [];
	for (let d = 0; d < depth; d++) {
		output.push([`\u00A0`, `\u00A0`, `\u00A0`, `\u00A0`, `\u00A0`]);
	}
	return output;
};