type FunctionType<T> = () => Promise<T> | T;

type FunctionResultsUnion<
  T extends FunctionType<any>[] | Readonly<FunctionType<any>[]>
> = {
  [K in keyof T]: Awaited<ReturnType<T[K]>>;
}[number];

const promiseFrame = async <
  T extends FunctionType<any>[] | Readonly<FunctionType<any>[]>,
  ResultsT = FunctionResultsUnion<T>
>(
  functions: T,
  limit?: number
): Promise<ResultsT[]> => {
  // Проверка первого аргумента
  if (!Array.isArray(functions)) {
    throw new Error('INVALID_ARGUMENT');
  }

  // Проверка второго аргумента
  if (limit !== undefined) {
    if (typeof limit !== 'number' || !Number.isInteger(limit) || limit <= 0) {
      throw new Error('INVALID_ARGUMENT');
    }
  }

  // Если нет функций, возвращаем пустой массив
  if (functions.length === 0) {
    return [] as ResultsT[];
  }

  // Если лимит не задан или больше/равен количеству функций, используем Promise.all
  if (limit === undefined || limit >= functions.length) {
    try {
      const promises = functions.map(fn => Promise.resolve(fn()));
      return await Promise.all(promises) as ResultsT[];
    } catch (error) {
      throw error;
    }
  }

  return new Promise((resolve, reject) => {
    const results = new Array(functions.length) as ResultsT[];
    let completedCount = 0;
    let runningCount = 0;
    let currentIndex = 0;
    let hasError = false;

    const runNext = () => {
      // Если была ошибка или все задачи запущены/завершены
      if (hasError || currentIndex >= functions.length) {
        return;
      }

      // Запускаем задачи пока есть лимит
      while (runningCount < limit && currentIndex < functions.length && !hasError) {
        const index = currentIndex;
        const func = functions[currentIndex];
        currentIndex++;
        runningCount++;

        Promise.resolve(func())
          .then(result => {
            results[index] = result;
            runningCount--;
            completedCount++;
            
            if (completedCount === functions.length) {
              resolve(results);
            } else {
              runNext();
            }
          })
          .catch(error => {
            hasError = true;
            // Отменяем все ожидающие запуска задачи
            runningCount--;
            reject(error);
          });
      }
    };

    runNext();
  });
};

export default promiseFrame;