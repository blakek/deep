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

export type DeepOmit<
  Object,
  PropertyPath extends Path,
  _OriginalObject = Object
> = PropertyPath extends string
  ? DeepOmit<Object, TS.String.Split<PropertyPath, '.'>>
  : PropertyPath extends []
  ? _OriginalObject
  : PropertyPath extends [PathPart]
  ? Omit<Object, PropertyPath[0]>
  : PropertyPath extends [infer A, ...infer B]
  ? A extends keyof Object
    ? B extends PathPart[]
      ? DeepOmit<Object[A], B, _OriginalObject>
      : _OriginalObject
    : _OriginalObject
  : unknown;

export type DeepOmitTestInput = {
  a: 42;
  b: { c: { d: { e: 4; f: 2 } } };
};

export type DeepOmitTestShallow = DeepOmit<DeepOmitTestInput, 'a'>;
export type DeepOmitTest2 = DeepOmit<DeepOmitTestInput, []>;
export type DeepOmitTestDeep = DeepOmit<DeepOmitTestInput, 'b.c.d.e'>;
export type DeepOmitTestDeep2 = DeepOmit<DeepOmitTestInput, ['b', 'c']>;
