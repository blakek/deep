export function isObject(object: any): boolean {
  if (object === null) return false;

  const type = typeof object;
  return type === 'object' || type === 'function';
}
