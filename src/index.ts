import { parse, Path } from 'pathington';
import { isObject } from './is-object';

const NotFound = Symbol('value not found');

export function traverseObject(object: any, path: string[]): any {
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

export function get(object: any, path?: Path, defaultValue?: any): any {
  if (path === undefined) return object;
  const value = traverseObject(object, parse(path));

  if (value === NotFound || value === undefined) {
    return defaultValue;
  }

  return value;
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
  const reference = traverseObject(object, parse(referencePath));

  if (!reference) return object;

  delete reference[finalPath];

  return object;
}

export function set(object: any, path: Path, value: any): any {
  const parsedPath = parse(path);
  let reference = object;

  parsedPath.forEach((key, index) => {
    if (index === parsedPath.length - 1) {
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

