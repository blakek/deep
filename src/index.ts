import { parse, Path } from 'pathington';
import { isObject } from './is-object';

const NotFound = Symbol('value not found');

export function traverseObject(
  object: any,
  path: string[],
  createNonExistantPaths = false
): any {
  // If the path has been exhausted, return the current object
  if (path.length === 0) {
    return object;
  }

  // If the value could not be found, return `defaultValue`
  if (!isObject(object) && !createNonExistantPaths) {
    return NotFound;
  }

  const [key, ...keys] = path;

  // Search deeper in the object
  if (key in object) {
    return traverseObject(object[key], keys, createNonExistantPaths);
  }

  // Key not in object but should be added.
  if (createNonExistantPaths) {
    object[key] = {};
    return traverseObject(object[key], keys, createNonExistantPaths);
  }

  // The key was not found in the object.
  return NotFound;
}

export function get(object: any, path?: Path, defaultValue?: any): any {
  if (path === undefined) return object;
  const value = traverseObject(object, parse(path));
  return value === NotFound ? defaultValue : value;
}

export function has(object: any, path: Path): boolean {
  const value = traverseObject(object, parse(path));
  return value !== NotFound;
}

export function remove(object: any, path: Path): any {
  if (path === undefined) return object;
  const parsedPath = parse(path);

  const referencePath = parsedPath.slice(0, -1);
  const finalPath = parsedPath[parsedPath.length - 1];
  const reference = traverseObject(object, parse(referencePath), false);

  if (!reference) return object;

  delete reference[finalPath];

  return object;
}

export function set(object: any, path: Path, value: any): any {
  if (path === undefined) return object;
  const parsedPath = parse(path);

  const referencePath = parsedPath.slice(0, -1);
  const finalPath = parsedPath[parsedPath.length - 1];
  const reference = traverseObject(object, parse(referencePath), true);

  reference[finalPath] = value;

  return object;
}
