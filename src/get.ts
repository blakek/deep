import {
  NotFound,
  ObjectLike,
  parsePath,
  Path,
  traverseObject
} from './shared';

export function get<
  Return = unknown,
  FallbackValue extends Return = Return,
  Input = ObjectLike
>(path: Path, object: Input, fallbackValue?: FallbackValue): Return {
  const parsedPath = parsePath(path);
  const value = traverseObject<Return>(object, parsedPath);

  if (value === NotFound || value === undefined) {
    return fallbackValue;
  }

  return value;
}