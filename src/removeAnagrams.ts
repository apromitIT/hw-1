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
const isArray = (x: unknown): x is unknown[] => Array.isArray(x);
const makeAssertStringFunc = makeAssertFunc(isString);
const makeAssertArrayFunc = makeAssertFunc(isArray);
const assertString = makeAssertStringFunc('INVALID_ELEMENT_IN_ARRAY');
const assertArray = makeAssertArrayFunc('INVALID_ARGUMENT');

type Meta = {
	str: string;
	count: number;
};

const normilize = (str: string): string => str.split('').sort().join('');

const removeAnagrams = (strings: string[]): string[] => {
	const metaMap = assertArray(strings)
		.map(assertString)
		.reduce((map, str) => {
			const norm = normilize(str);
			const meta = map.get(norm) ?? { str, count: 0 };
			meta.count += 1;
			map.set(norm, meta);
			return map;
		}, new Map<string, Meta>());

	return Array.from(metaMap.values())
		.filter((meta) => meta.count === 1)
		.map(({ str }) => str);
};

export default removeAnagrams;