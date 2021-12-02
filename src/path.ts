import * as TS from 'ts-toolbelt';
import { Path, PathPart } from './shared';

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
        ? {
            [Prop in Exclude<keyof Object, Key>]: DeepOmit<Object[Prop], Rest>;
          }
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
