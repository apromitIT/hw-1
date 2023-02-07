const pow = curry((base: number, exponent: number) => {

	if (typeof base != 'number' || typeof exponent != 'number') {
		throw new Error('INVALID_ARGUMENT')
	} else return Math.pow(base, exponent)
});


function curry(func: Function) {
	return function curried(...args: number[]) {
		if (args.length >= func.length) {
			return func.apply(this, args)
		}
		return curried.bind(this, ...args)
	}
}


export default pow;
