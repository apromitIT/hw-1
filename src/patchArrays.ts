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
const makeAssertNumberFunc = makeAssertFunc(isNumber);

const assertNumber = makeAssertNumberFunc('INVALID_ARGUMENT');

const patchArrays = () => {
  Object.assign(Array.prototype, {
    count<T>(this: T[]): number {
      return this.length;
    },

    insert<T>(this: T[], index: number, value: T): T[] {
      this.splice(assertNumber(index) < 0 ? 0 : index, 0, value);
      return this;
    },

    remove<T>(this: T[], value: T): T[] {
      const index = this.indexOf(value);
      if (index > -1) {
        this.splice(index, 1);
      }
      return this;
    },
  });
};

export default patchArrays;