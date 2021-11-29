import {
  isObject,
  ObjectLike,
  parsePath,
  Path,
  traverseObject
} from './shared';

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
