import { deepEqual } from 'power-assert';
import { deepKeyMirror } from '../src';
import 'jest';

// not an object nor an array
describe(deepKeyMirror.name, () => {
  test('an empty object', () => {
    deepEqual(deepKeyMirror({}), {});
  });

  test('an array', () => {
    const array = { array: ['foo', 'bar', 'baz'] };
    const mirrored = deepKeyMirror(array);
    deepEqual(mirrored.array[0], 'array[0]');
    deepEqual(mirrored.array[1], 'array[1]');
    deepEqual(mirrored.array[2], 'array[2]');
  });

  test('a flat object', () => {
    const obj = {
      null: null,
      undefined: undefined,
      string: 'string',
    };
    const actual = deepKeyMirror(obj);
    deepEqual(actual.null, 'null');
    deepEqual(actual.undefined, 'undefined');
    deepEqual(actual.string, 'string');
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
    deepEqual(actual.bread, 'bread');
    deepEqual(actual.beverage.milk, 'beverage.milk');
    deepEqual(actual.beverage.coffee, 'beverage.coffee');
    deepEqual(actual.fruits[0], 'fruits[0]');
    deepEqual(actual.fruits[1], 'fruits[1]');
    deepEqual(actual.fruits[2], undefined);
    deepEqual(actual.people[0], {
      name: 'people[0].name',
      age: 'people[0].age',
      addr: { zip: 'people[0].addr.zip', lines: ['people[0].addr.lines[0]', 'people[0].addr.lines[1]'] },
    });
    deepEqual(actual.people[1], {
      name: 'people[1].name',
      age: 'people[1].age',
      addr: { zip: 'people[1].addr.zip', lines: ['people[1].addr.lines[0]', 'people[1].addr.lines[1]'] },
    });
    deepEqual(actual.people[2], undefined);
    // @ts-expect-error property nonExistingProperty does not exist and won't compile
    deepKeyMirror(actual.nonExistingProperty);
  });
});
