import {
  NotFound,
  ObjectLike,
  parsePath,
  Path,
  traverseObject
} from './shared';

export function getOr(
  defaultValue: unknown,
  path: Path,
  object: ObjectLike
): unknown {
  if (path === undefined) {
    return object;
  }

  const value = traverseObject(object, parsePath(path));

  if (value === NotFound || value === undefined) {
    return defaultValue;
  }

  return value;
}

export function get(path: Path, object: ObjectLike): unknown {
  return getOr(undefined, path, object);
}
