export function clone<T extends unknown>(value: T): T {
  if (value instanceof Date) {
    return new Date((value as Date).getTime()) as T;
  }

  if (value instanceof Map) {
    const result = new Map();

    value.forEach((nestedValue, key) => {
      result.set(key, clone(nestedValue));
    });

    return result as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  if (value instanceof Set) {
    const result = new Set();

    value.forEach(x => {
      result.add(clone(x));
    });

    return result as T;
  }

  if (typeof value === 'object') {
    if (value === null) {
      return null;
    }

    const result = (Array.isArray(value) ? [] : {}) as T;

    for (const key in value) {
      result[key] = clone(value[key]);
    }

    return result;
  }

  return value;
}
