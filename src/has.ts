import {
  NotFound,
  ObjectLike,
  parsePath,
  Path,
  traverseObject
} from './shared';

export function has(path: Path, object: ObjectLike): boolean {
  const value = traverseObject(object, parsePath(path));
  return value !== NotFound;
}
