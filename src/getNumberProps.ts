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


const isNumber = (x: unknown): x is number => typeof x === 'number';
const isObject = (x: unknown): x is object =>
	x !== null && !Array.isArray(x) && typeof x === 'object';
const  makeAssertObjectFunc = makeAssertFunc(isObject);

const assertObject = makeAssertObjectFunc('INVALID_ARGUMENT');

const recGetNumberProps = (obj: object): string[] =>
	Object.entries(obj)
		.filter(([k, v]) => isNumber(v) || isObject(v))
		.flatMap(([k, v]) => (isObject(v) ? recGetNumberProps(v) : [k]))
		.sort();

const getNumberProps = (obj: object): string[] => {
	return recGetNumberProps(assertObject(obj));
};

export default getNumberProps;
