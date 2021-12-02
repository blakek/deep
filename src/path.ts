import * as TS from 'ts-toolbelt';
import { PathPart } from './shared';

export type DeepGet<
  Object,
  Path,
  Fallback = unknown
> = Path extends readonly PathPart[]
  ? TS.Object.Path<Object, Path>
  : Path extends string
  ? TS.Object.Path<Object, TS.String.Split<Path, '.'>>
  : Fallback;
