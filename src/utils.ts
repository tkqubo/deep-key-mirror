import { Primitive } from './model';

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isPrimitive(value: unknown): value is Primitive {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    !isDefined(value)
  );
}

export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

export function isArray(value: unknown): value is any[] {
  return value instanceof Array;
}
