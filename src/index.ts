import { curry } from '@blakek/curry';
import { parse } from 'pathington';
import { isObject } from './is-object';

export type Path = Array<number | string> | string;
export type ObjectLike = Record<keyof unknown, unknown>;
export type WithProperties = ObjectLike | unknown[];

const NotFound = Symbol('curriable placeholder');

function getObjectTypeName(object: unknown): string {
  return toString.call(object).slice(8, -1).toLowerCase();
}

const cloneActions = {
  _: <T>(value: T) => value,
  array: <T>(value: T) => clone(value),
  object: <T>(value: T) => clone(value),
  date: (value: Date) => new Date(value.getTime())
} as const;

type CloneFn = <T>(value: T) => T;
type CloneAction = keyof typeof cloneActions;

export function clone<T extends WithProperties>(object: T): T {
  const result = (Array.isArray(object) ? [] : {}) as T;

  for (const key in object) {
    const value = object[key];
    const typename = getObjectTypeName(value);

    const action = (cloneActions[typename as CloneAction] ??
      cloneActions._) as CloneFn;

    result[key] = action(value);
  }

  return result;
}

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

function _omit(path: Path, object: WithProperties): WithProperties {
  return _remove(path, clone(object));
}

function _pluck(properties: Path[], object: any): any {
  return properties.reduce(
    (subset, property) => _set(_get(property, object), property, subset),
    {}
  );
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
export const omit = curry(_omit);
export const pluck = curry(_pluck);
export const remove = curry(_remove);
export const set = curry(_set);
