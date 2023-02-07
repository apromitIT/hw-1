// const multiply = mult((a: number, b: number) => {
// 	if (typeof a != 'number' || typeof b != 'number') {
// 		throw new Error('INVALID_ARGUMENT')
// 	} else return a * b
// });


// function mult(func: Function) {
// return function curried(...args: number[]) {
// 	if (args.length >= func.length) {
// 		return func.apply(this, args)
// 	}
// 	return curried.bind(this, ...args)
// }
// }

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
