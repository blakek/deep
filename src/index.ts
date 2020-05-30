import { parse, Path } from 'pathington';
import { isObject } from './is-object';

function runGet(object: any, path: string[], defaultValue?: any): any {
  // If the path has been exhausted, return the current object
  if (path.length === 0) {
    return object;
  }

  // If the value could not be found, return `defaultValue`
  if (!isObject(object)) {
    return defaultValue;
  }

  const [key, ...keys] = path;

  // If the key is not in the object, return `defaultValue`
  if (!(key in object)) {
    return defaultValue;
  }

  // Search deeper in the object
  return runGet(object[key], keys, defaultValue);
}

export function get(object: any, path?: Path, defaultValue?: any): any {
  if (path === undefined) return object;
  return runGet(object, parse(path), defaultValue);
}
