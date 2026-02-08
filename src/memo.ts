const memo = <T extends (...args: any[]) => any>(
  func: T,
  time?: number
): ((...arg: Parameters<T>) => ReturnType<T>) => {
  // Проверка первого аргумента
  if (typeof func !== 'function') {
    throw new Error('INVALID_ARGUMENT');
  }

  // Проверка второго аргумента
  if (time !== undefined) {
    if (typeof time !== 'number' || time < 0) {
      throw new Error('INVALID_ARGUMENT');
    }
  }

  // Кэш для хранения результатов: ключ - сериализованные аргументы, значение - результат и время
  const cache = new Map<string, {
    result: ReturnType<T>;
    timestamp: number;
    timerId?: NodeJS.Timeout;
  }>();

  // Функция для создания ключа из аргументов (shallow-сравнение через сериализацию)
  const createKey = (args: any[]): string => {
    // Для каждого аргумента используем его тип и значение
    return args.map(arg => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      
      const type = typeof arg;
      if (type === 'boolean' || type === 'number' || type === 'string') {
        return `${type}:${arg}`;
      }
      
      // Для объектов, массивов, функций - используем ссылку
      return `${type}:${JSON.stringify(arg)}@${Object.getOwnPropertySymbols(arg).join(',')}`;
    }).join('|');
  };

  // Функция для очистки кэша по ключу
  const clearCacheEntry = (key: string) => {
    const entry = cache.get(key);
    if (entry?.timerId) {
      clearTimeout(entry.timerId);
    }
    cache.delete(key);
  };

  // Функция для установки таймера очистки
  const setExpirationTimer = (key: string) => {
    if (time === undefined) return; // Бесконечная мемоизация
    
    // Очищаем предыдущий таймер, если есть
    const entry = cache.get(key);
    if (entry?.timerId) {
      clearTimeout(entry.timerId);
    }

    // Устанавливаем новый таймер
    const timerId = setTimeout(() => {
      clearCacheEntry(key);
    }, time);

    // Обновляем запись с новым timerId
    if (entry) {
      entry.timerId = timerId;
      entry.timestamp = Date.now();
    }
  };

  // Возвращаем мемоизированную функцию
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = createKey(args);
    
    // Проверяем, есть ли результат в кэше
    if (cache.has(key)) {
      const entry = cache.get(key)!;
      
      // Если указано время и результат еще не истек
      if (time === undefined || Date.now() - entry.timestamp < time) {
        // Обновляем таймер для этого результата (продлеваем мемоизацию)
        setExpirationTimer(key);
        return entry.result;
      } else {
        // Результат истек, удаляем его
        clearCacheEntry(key);
      }
    }

    // Вычисляем результат
    const result = func(...args);
    
    // Сохраняем результат в кэш
    cache.set(key, {
      result,
      timestamp: Date.now()
    });

    // Устанавливаем таймер очистки, если нужно
    setExpirationTimer(key);

    return result;
  };
};

export default memo;
