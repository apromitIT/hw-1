const multiply = (num: number) => {
	if (typeof num != 'number') {
		throw new Error('INVALID_ARGUMENT')
	}
	return function (x: number) {
		if (typeof x != 'number') {
			throw new Error('INVALID_ARGUMENT')
		}
		return x * num
	}
}

export default multiply;