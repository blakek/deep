import { curry } from '@blakek/curry';
import { parse } from 'pathington';
import { isObject } from './is-object';

export type Path = Array<number | string> | string;

const NotFound = Symbol('curriable placeholder');

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

function _getOr(defaultValue: any, path: Path, object: any): any {
  if (path === undefined) return object;

  const value = traverseObject(object, parse(path));

  if (value === NotFound || value === undefined) {
    return defaultValue;
  }

  return value;
}

const _get = (path: Path, object: any): any => _getOr(undefined, path, object);

function _has(path: Path, object: any): boolean {
  const value = traverseObject(object, parse(path));
  return value !== NotFound;
}

function _remove(path: Path, object: any): any {
  if (path === undefined) return object;
  const parsedPath = parse(path);

  const referencePath = parsedPath.slice(0, -1);
  const finalPath = parsedPath[parsedPath.length - 1];
  const reference = traverseObject(object, parse(referencePath));

  if (!reference) return object;

  delete reference[finalPath];

  return object;
}

function _set(value: any, path: Path, object: any): any {
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

export const get = curry(_get);
export const getOr = curry(_getOr);
export const has = curry(_has);
export const remove = curry(_remove);
export const set = curry(_set);
