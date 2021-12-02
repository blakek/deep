import test from 'ava';
import { createOmit, omit } from '../src';

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

test('create a reusable omit function', t => {
  const omitPassword = createOmit(['password', 'dashboard.roles'] as [
    'password',
    'dashboard.roles'
  ]);

  t.deepEqual(omitPassword({}), {});
  t.deepEqual(omitPassword({ password: 'test', a: 123 }), { a: 123 });
  t.deepEqual(
    omitPassword({
      password: 'test',
      dashboard: { name: 'cool', roles: [] },
      a: 123
    }),
    {
      dashboard: { name: 'cool' },
      a: 123
    }
  );
});
