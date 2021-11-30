import { get } from './get';
import { set } from './set';
import { ObjectLike, Path } from './shared';

export function pluck<
  Return extends Record<keyof any, any> = Record<keyof any, unknown>
>(properties: Path[], object: ObjectLike): Return {
  return properties.reduce(
    (subset, property) => set(get(property, object), property, subset),
    {}
  ) as Return;
}
