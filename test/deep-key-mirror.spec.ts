import { describe, expect, test } from 'vitest';
import { deepKeyMirror } from '../src';

// not an object nor an array
describe(deepKeyMirror.name, () => {
  test('an empty object', () => {
    expect(deepKeyMirror({})).toEqual({});
  });

  test('an array', () => {
    const array = { array: ['foo', 'bar', 'baz'] };
    const mirrored = deepKeyMirror(array);
    expect(mirrored.array[0]).toBe('array[0]');
    expect(mirrored.array[1]).toBe('array[1]');
    expect(mirrored.array[2]).toBe('array[2]');
  });

  test('a flat object', () => {
    const obj = {
      null: null,
      undefined: undefined,
      string: 'string',
    };
    const actual = deepKeyMirror(obj);
    expect(actual.null).toBe('null');
    expect(actual.undefined).toBe('undefined');
    expect(actual.string).toBe('string');
  });

  test('a nested object', () => {
    const obj = {
      bread: null,
      beverage: {
        milk: null,
        coffee: null,
      },
      fruits: [null, null],
      people: [
        { name: null, age: null, addr: { zip: null, lines: [null, null] } },
        { name: null, age: null, addr: { zip: null, lines: [null, null] } },
      ],
    };
    const actual = deepKeyMirror(obj);
    expect(actual.bread).toBe('bread');
    expect(actual.beverage.milk).toBe('beverage.milk');
    expect(actual.beverage.coffee).toBe('beverage.coffee');
    expect(actual.fruits[0]).toBe('fruits[0]');
    expect(actual.fruits[1]).toBe('fruits[1]');
    expect(actual.fruits[2]).toBeUndefined();
    expect(actual.people[0]).toEqual({
      name: 'people[0].name',
      age: 'people[0].age',
      addr: { zip: 'people[0].addr.zip', lines: ['people[0].addr.lines[0]', 'people[0].addr.lines[1]'] },
    });
    expect(actual.people[1]).toEqual({
      name: 'people[1].name',
      age: 'people[1].age',
      addr: { zip: 'people[1].addr.zip', lines: ['people[1].addr.lines[0]', 'people[1].addr.lines[1]'] },
    });
    expect(actual.people[2]).toBeUndefined();
    // @ts-expect-error property nonExistingProperty does not exist and won't compile
    deepKeyMirror(actual.nonExistingProperty);
  });
});
