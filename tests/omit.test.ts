import test from 'ava';
import { omit } from '../src';

test('returns a clone of an object with properties removed', t => {
  t.deepEqual(omit([], {}), {});
  t.deepEqual(omit(['nothing'], {}), {});

  const o = { value: 42, nested: { again: 'yep' } };
  t.deepEqual(omit(['value'], o), { nested: { again: 'yep' } });
  t.deepEqual(omit(['nested'], o), { value: 42 });
  t.deepEqual(omit([['nested', 'again']], o), { value: 42, nested: {} });
  t.deepEqual(omit(['nested.again', 'value'], o), { nested: {} });

  const a = [1, 2, [3, 4], { subArray: [true] }] as const;
  t.deepEqual(omit(['0'], a), [undefined, 2, [3, 4], { subArray: [true] }]);
  t.deepEqual(omit(['3.subArray'], a), [1, 2, [3, 4], {}]);
});
