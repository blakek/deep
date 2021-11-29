declare module 'pathington' {
  type Path = keyof any | Array<keyof any> | ReadonlyArray<keyof any>;
  type QuoteCharacter = '"' | "'" | '`';

  export function parse(path: Path): string[];

  export function create(
    path: Array<keyof any>,
    quote?: QuoteCharacter
  ): string;
}
