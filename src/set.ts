import { isObject, ObjectLike, parsePath, Path } from './shared';

export function set(
  value: unknown,
  path: Path,
  object: ObjectLike
): ObjectLike {
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
