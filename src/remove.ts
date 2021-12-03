import {
  DeepOmit,
  isObject,
  ObjectLike,
  parsePath,
  Path,
  traverseObject
} from './shared';

export function remove<
  Object extends ObjectLike,
  PropertyPath extends Path,
  Return = DeepOmit<Object, PropertyPath>
>(path: PropertyPath, object: Object): Return;

export function remove<Return extends unknown>(
  path: Path,
  object: ObjectLike
): Return;

export function remove<T extends ObjectLike>(path: Path, object: T): unknown {
  if (path === undefined) {
    return object;
  }

  const parsedPath = parsePath(path);
  const referencePath = parsedPath.slice(0, -1);
  const finalPath = parsedPath[parsedPath.length - 1];
  const reference = traverseObject(object, parsePath(referencePath));

  if (isObject(reference)) {
    delete reference[finalPath];
  }

  return object;
}

export function createRemove<PropertyPath extends Path>(
  path: PropertyPath
): <Object extends ObjectLike, Return = DeepOmit<Object, PropertyPath>>(
  object: Object
) => Return;

export function createRemove<PropertyPath extends Path>(
  path: PropertyPath
): <Return = unknown>(object: ObjectLike) => Return;

export function createRemove(path: Path) {
  return (object: ObjectLike) => remove(path, object);
}
