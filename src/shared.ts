import { parse as parsePath } from 'pathington';

export type PathPart = keyof any;
export type Path = string | Array<PathPart> | ReadonlyArray<PathPart>;

export type ObjectKey = keyof any;
export type ObjectLike = Record<ObjectKey, any>;

export const NotFound = Symbol('value was not found');

export function isObject(object: unknown): object is ObjectLike {
  if (object === null) {
    return false;
  }

  const type = typeof object;

  return type === 'object' || type === 'function';
}

export function traverseObject<Return extends unknown = unknown>(
  object: unknown,
  path: string[]
): Return | typeof NotFound {
  // If the path has been exhausted, return the current object
  if (path.length === 0) {
    return object as Return;
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

export { parsePath };
