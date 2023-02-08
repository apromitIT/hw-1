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

type Func = (...args: unknown[]) => unknown;

const isNumber = (x: unknown): x is number => typeof x === 'number';
const isFunction = (x: unknown): x is Func => typeof x === 'function';

const makeAssertNumberFunc = makeAssertFunc(isNumber);
const makeAssertFunctionFunc = makeAssertFunc(isFunction);

const assertFunction = makeAssertFunctionFunc('INVALID_ARGUMENT');
const assertNumber = makeAssertNumberFunc('INVALID_ARGUMENT');

const planEvent = <T>(cb: () => T, timeout = 0): Promise<T> => {
  assertFunction(cb) && assertNumber(timeout);
  return new Promise((resolve) => setTimeout(() => resolve(cb()), timeout));
};
export default planEvent;
