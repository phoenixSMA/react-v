export const fixUndefined = (...args: (string | number | undefined)[]): string => {
	if (args.includes(undefined)) {
		return `\u00A0`;
	}
	return [...args].join(``);
};