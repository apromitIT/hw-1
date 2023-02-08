type CheckType<T> = (x: unknown) => x is T;
type AssertFunc<T> = (x: unknown) => T;
type CustomAssertFunc<T> = (errorMsg: string) => AssertFunc<T>;

function makeAssertFunc<T>(checkType: CheckType<T>): CustomAssertFunc<T> {
	return (errorMsg: string): AssertFunc<T> =>
		(x: unknown): T => {
			if (!checkType(x)) {
				throw new Error(errorMsg);
			}
			return x;
		};
}

const isString = (x: unknown): x is string => typeof x === 'string';
const makeAssertStringFunc = makeAssertFunc(isString);

const assertStirng = makeAssertStringFunc('INVALID_ARGUMENT');

const sort = (str: string) => {
	return assertStirng(str)
		.toLowerCase()
		.split(' ')
		.sort((a, b) => a.length - b.length)
		.map((word) => word.split('').sort().join(''))
		.join(' ');
};

export default sort;
