const intersection = (...args: [xs: number[], ys: number[]]): number[] => {
	if (args.length !== 2) {
		throw new Error('INVALID_ARGUMENTS_COUNT');
	} else if (!Array.isArray(args[0]) || !Array.isArray(args[1])) {
		throw new Error('INVALID_ARGUMENT');
	} else if (isElNum(args[0]) != true || isElNum(args[1]) != true) {
		throw new Error('INVALID_ELEMENT_IN_ARRAY');
	}
	const set = new Set(args.flat());
	const [xs, ys] = args;
	return Array.from(set).filter((x) => xs.includes(x) && ys.includes(x));

};

function isElNum(arr: number[]) {

	for (let elem of arr) {
		if (typeof elem != "number") {
			return false;
		}
	}

	return true;
}

export default intersection;
