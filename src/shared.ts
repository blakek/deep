import { parse as parsePath } from 'pathington';
import * as TS from 'ts-toolbelt';

export type PathPart = keyof any;
export type Path = string | Array<PathPart> | ReadonlyArray<PathPart>;

export type ObjectKey = keyof any;
export type ObjectLike = Record<ObjectKey, any>;

export type DeepGet<
  Object,
  PropertyPath extends Path,
  Fallback = unknown
> = PropertyPath extends readonly PathPart[]
  ? TS.Object.Path<Object, PropertyPath>
  : PropertyPath extends string
  ? TS.Object.Path<Object, TS.String.Split<PropertyPath, '.'>>
  : Fallback;

export type DeepOmit<Object, PropertyPath extends Path> =
  // convert string path to array
  PropertyPath extends string
    ? DeepOmit<Object, TS.String.Split<PropertyPath, '.'>>
    : // empty path returns original object
    PropertyPath extends []
    ? Object
    : PropertyPath extends [infer Key, ...infer Rest]
    ? // check if the path's end has been reached
      Rest extends []
      ? Key extends keyof Object
        ? Omit<Object, Key>
        : Object
      : // check the next part of the path
      Rest extends PathPart[]
      ? Key extends keyof Object
        ? {
            [Prop in keyof Object]: DeepOmit<Object[Prop], Rest>;
          }
        : Object
      : Object
    : Object;

export type DeepOmitPaths<
  Object,
  PropertyPaths extends Path[]
> = PropertyPaths extends []
  ? Object
  : PropertyPaths extends [infer First, ...infer Rest]
  ? First extends Path
    ? Rest extends Path[]
      ? DeepOmitPaths<DeepOmit<Object, First>, Rest>
      : never
    : never
  : never;

export const NotFound = Symbol('value was not found');

export function isObject(object: unknown): object is ObjectLike {
  if (object === null) {
    return false;
  }

  const type = typeof object;

  return type === 'object' || type === 'function';
}

export function traverseObject<Return extends unknown = unknown>(
  object: unknown,
  path: string[]
): Return | typeof NotFound {
  // If the path has been exhausted, return the current object
  if (path.length === 0) {
    return object as Return;
  }

  // If the value could not be found, return `defaultValue`
  if (!isObject(object)) {
    return NotFound;
  }

  const [key, ...keys] = path;

  // Search deeper in the object
  if (key in object) {
    return traverseObject(object[key], keys);
  }

  // The key was not found in the object.
  return NotFound;
}

export { parsePath };
