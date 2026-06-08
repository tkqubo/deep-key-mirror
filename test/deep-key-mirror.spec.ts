import { describe, expect, test } from 'vitest';
import { deepKeyMirror } from '../src';

describe(deepKeyMirror.name, () => {
  test('an empty object', () => {
    expect(deepKeyMirror({})).toEqual({});
  });

  test('a top-level string array becomes an object keyed by its elements', () => {
    expect(deepKeyMirror(['apple', 'banana', 'grape'])).toEqual({
      apple: 'apple',
      banana: 'banana',
      grape: 'grape',
    });
  });

  test('a string array property becomes an object with dot-paths', () => {
    expect(deepKeyMirror({ array: ['foo', 'bar', 'baz'] })).toEqual({
      array: { foo: 'array.foo', bar: 'array.bar', baz: 'array.baz' },
    });
  });

  test('a flat object', () => {
    const obj = {
      null: null,
      undefined: undefined,
      string: 'string',
    };
    expect(deepKeyMirror(obj)).toEqual({
      null: 'null',
      undefined: 'undefined',
      string: 'string',
    });
  });

  test('a nested object with a string array', () => {
    const actual = deepKeyMirror({
      bread: null,
      beverage: {
        milk: null,
        coffee: null,
        beer: 'BEER!',
      },
      fruits: ['orange', 'apple'],
    });
    expect(actual).toEqual({
      bread: 'bread',
      beverage: {
        milk: 'beverage.milk',
        coffee: 'beverage.coffee',
        beer: 'beverage.beer',
      },
      fruits: {
        orange: 'fruits.orange',
        apple: 'fruits.apple',
      },
    });
  });

  test('an object array keeps the legacy index-path behaviour', () => {
    const actual = deepKeyMirror({
      people: [
        { name: null, age: null },
        { name: null, age: null },
      ],
    });
    expect(actual).toEqual({
      people: [
        { name: 'people[0].name', age: 'people[0].age' },
        { name: 'people[1].name', age: 'people[1].age' },
      ],
    });
  });

  test('a null array keeps the legacy index-path behaviour', () => {
    expect(deepKeyMirror({ fruits: [null, null] })).toEqual({
      fruits: ['fruits[0]', 'fruits[1]'],
    });
  });

  // Type-level checks: the annotation fails to compile (tsc) unless the
  // return type is exactly the expected literal type.
  describe('return type (inline literals)', () => {
    test('a top-level string array yields a literal object type', () => {
      const actual: { apple: 'apple'; banana: 'banana'; grape: 'grape' } = deepKeyMirror(['apple', 'banana', 'grape']);
      expect(actual).toEqual({ apple: 'apple', banana: 'banana', grape: 'grape' });
    });

    test('a nested object yields a literal type including the string-array object', () => {
      const actual: {
        bread: 'bread';
        beverage: { milk: 'beverage.milk'; beer: 'beverage.beer' };
        fruits: { orange: 'fruits.orange'; apple: 'fruits.apple' };
      } = deepKeyMirror({
        bread: null,
        beverage: { milk: null, beer: 'BEER!' },
        fruits: ['orange', 'apple'],
      });
      expect(actual.fruits).toEqual({ orange: 'fruits.orange', apple: 'fruits.apple' });
    });
  });
});
