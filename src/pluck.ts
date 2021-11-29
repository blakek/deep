import { get } from './get';
import { set } from './set';
import { ObjectLike, Path } from './shared';

export function pluck(properties: Path[], object: ObjectLike): unknown {
  return properties.reduce(
    (subset, property) => set(get(property, object), property, subset),
    {}
  );
}
