import { isObject, ObjectLike, parsePath, Path } from './shared';

export function set<
  Value = unknown,
  Return extends ObjectLike = unknown,
  Input extends ObjectLike = Return
>(value: Value, path: Path, object: Input): Return {
  const parsedPath = parsePath(path);
  let reference: any = object;

  parsedPath.forEach((key, index) => {
    const isLastElement = index === parsedPath.length - 1;

    if (isLastElement) {
      reference[key] = value;
      return;
    }

    if (!isObject(reference[key])) {
      reference[key] = {};
    }

    reference = reference[key];
  });

  return object;
}

export function createSetter<
  Value = unknown,
  Return extends ObjectLike = unknown,
  Input extends ObjectLike = Return
>(path: Path, object: Input): (value: Value) => Return {
  return (value: Value) => set(value, path, object);
}
