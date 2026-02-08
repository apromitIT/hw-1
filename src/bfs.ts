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
const isObject = (x: unknown): x is object =>
	x !== null && !Array.isArray(x) && typeof x === 'object';
const makeAssertObjectFunc = makeAssertFunc(isObject);



const assertObject = makeAssertObjectFunc('INVALID_ARGUMENT');

type Node = string;
type Tree = Record<Node, Node[]>;
type Level = Node[];

const bfs = (tree: Tree): Node[] => {
	const root = Object.keys(assertObject(tree)).at(0);
	return root === undefined ? [] : Array.from(genBfs(tree, root)).flat();
};

export default bfs;

function* genBfs(tree: Tree, root: Node): Generator<Level> {
	let level = [root];
	while (level.length > 0) {
		yield level;
		level = level.flatMap((node) => tree[node]);
	}
}