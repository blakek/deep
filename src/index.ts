import { parse } from 'pathington';

export type ObjectKey = keyof any;
export type PathPart = ObjectKey;
export type Path = string | Array<PathPart> | ReadonlyArray<PathPart>;

export type ObjectLike = Record<ObjectKey, any>;

export const NotFound = Symbol('value was not found');

export function isObject(object: unknown): object is ObjectLike {
  if (object === null) {
    return false;
  }

  const type = typeof object;

  return type === 'object' || type === 'function';
}

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

export function traverseObject(object: unknown, path: string[]): unknown {
  // If the path has been exhausted, return the current object
  if (path.length === 0) {
    return object;
  }

  // If the value could not be found, return `defaultValue`
  if (!isObject(object)) {
    return NotFound;
  }

  const [key, ...keys] = path;

  // Search deeper in the object
  if (key in object) {
    return traverseObject(object[key], keys);
  }

  // The key was not found in the object.
  return NotFound;
}

export function getOr(
  defaultValue: unknown,
  path: Path,
  object: ObjectLike
): unknown {
  if (path === undefined) return object;

  const value = traverseObject(object, parse(path));

  if (value === NotFound || value === undefined) {
    return defaultValue;
  }

  return value;
}

export function get(path: Path, object: ObjectLike): unknown {
  return getOr(undefined, path, object);
}

export function has(path: Path, object: ObjectLike): boolean {
  const value = traverseObject(object, parse(path));
  return value !== NotFound;
}

export function remove<T extends ObjectLike>(path: Path, object: T): unknown {
  if (path === undefined) {
    return object;
  }

  const parsedPath = parse(path);
  const referencePath = parsedPath.slice(0, -1);
  const finalPath = parsedPath[parsedPath.length - 1];
  const reference = traverseObject(object, parse(referencePath));

  if (isObject(reference)) {
    delete reference[finalPath];
  }

  return object;
}

export function omit(properties: Path[], object: ObjectLike): ObjectLike {
  const cloned = clone(object);
  properties.forEach(property => remove(property, cloned));
  return cloned;
}

export function pluck(properties: Path[], object: ObjectLike): unknown {
  return properties.reduce(
    (subset, property) => set(get(property, object), property, subset),
    {}
  );
}

export function set(
  value: unknown,
  path: Path,
  object: ObjectLike
): ObjectLike {
  const parsedPath = parse(path);
  let reference: any = object;

  parsedPath.forEach((key, index) => {
    const isLastElement = index === parsedPath.length - 1;

    if (isLastElement) {
      reference[key] = value;
      return;
    }

    if (!isObject(reference[key])) {
      reference[key] = {};
    }

    reference = reference[key];
  });

  return object;
}
