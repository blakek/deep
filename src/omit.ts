import { clone } from './clone';
import { remove } from './remove';
import { ObjectLike, Path } from './shared';

export function omit(properties: Path[], object: ObjectLike): ObjectLike {
  const cloned = clone(object);
  properties.forEach(property => remove(property, cloned));
  return cloned;
}

export function createOmit(
  properties: Path[]
): (object: ObjectLike) => ObjectLike {
  return (object: ObjectLike) => omit(properties, object);
}
