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

const dfs = (tree: Tree): Node[] => {
  const root = Object.keys(assertObject(tree)).at(0);
  return recDfs(tree, root);
};


function recDfs(tree: Tree, root?: Node, nodes: Node[] = []): Node[] {
  if (root === undefined) {
    return nodes;
  }

  nodes.push(root);
  const childs = tree[root].slice();

  while (childs.length !== 0) {
    const nextRoot = childs.shift();
    recDfs(tree, nextRoot, nodes);
  }
  return nodes;
}

export default dfs;
