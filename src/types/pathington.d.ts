declare module 'pathington';

export type Path = Array<number | string> | string;
type QuoteCharacter = '"' | "'" | '`';

export function parse(path: Path): string[];

export function create(
  path: Array<number | string>,
  quote?: QuoteCharacter
): string;
