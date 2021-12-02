import { clone } from './clone';
import { remove } from './remove';
import { DeepOmitPaths, ObjectLike, Path } from './shared';

export function omit<
  Object extends ObjectLike,
  Paths extends Path[],
  Return = DeepOmitPaths<Object, Paths>
>(properties: Paths, object: Object): Return;

export function omit<Return extends unknown>(
  properties: Path[],
  object: ObjectLike
): Return;

export function omit(properties: Path[], object: ObjectLike) {
  const cloned = clone(object);
  properties.forEach(property => remove(property, cloned));
  return cloned;
}

export function createOmit<Paths extends Path[]>(
  properties: Paths
): <Object extends ObjectLike, Return = DeepOmitPaths<Object, Paths>>(
  object: Object
) => Return;

export function createOmit<Paths extends Path[]>(
  properties: Paths
): <Return = unknown>(object: ObjectLike) => Return;

export function createOmit(properties: Path[]) {
  return (object: ObjectLike) => omit(properties, object);
}
