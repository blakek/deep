import {
  DeepGet,
  NotFound,
  ObjectLike,
  parsePath,
  Path,
  traverseObject
} from './shared';

// HACK: Workaround if path is an array but parts are not known
export function get<
  Return,
  FallbackValue = Return,
  Input = ObjectLike,
  PropertyPath extends string[] = string[]
>(
  path: PropertyPath,
  object: Input,
  fallbackValue?: FallbackValue
): Return | FallbackValue;

export function get<
  PropertyPath extends string | readonly string[],
  FallbackValue,
  Input
>(
  path: PropertyPath,
  object: Input,
  fallbackValue?: FallbackValue
): DeepGet<Input, PropertyPath, FallbackValue>;

export function get<Return, FallbackValue = Return, Input = ObjectLike>(
  path: Path,
  object: Input,
  fallbackValue?: FallbackValue
): Return | FallbackValue;

export function get(path: Path, object: ObjectLike, fallbackValue?: unknown) {
  const parsedPath = parsePath(path);
  const value = traverseObject(object, parsedPath);

  if (value === NotFound || value === undefined) {
    return fallbackValue;
  }

  return value;
}

export function createGetter<
  Return = unknown,
  FallbackValue extends Return = Return,
  Input = ObjectLike
>(path: Path, fallbackValue?: FallbackValue): (object: Input) => Return {
  return (object: Input) => get(path, object, fallbackValue);
}
