import test from 'ava';
import { createRemove, remove } from '../src';

test('removes a path from an object', t => {
  t.deepEqual(remove('', {}), {});
  t.deepEqual(remove('username', { username: 'blakek' }), {});
  t.deepEqual(remove('nothing', { username: 'blakek' }), {
    username: 'blakek'
  });
  t.deepEqual(remove('deep.nothing', { username: 'blakek' }), {
    username: 'blakek'
  });
  t.deepEqual(remove('username.extra', { username: 'blakek' }), {
    username: 'blakek'
  });

  // TODO: fix type for removing from arrays
  t.deepEqual(
    remove<{ value: (number | Record<string, unknown>)[] }>('value.2.isCool', {
      value: [1, 2, { isCool: true }]
    }),
    { value: [1, 2, {}] }
  );
});

test('handles empty-string key', t => {
  t.deepEqual(remove('', { '': 'abc', v: [1] }), { v: [1] });
});

test('create a reusable remove function', t => {
  const removeAB = createRemove('a.b');

  t.deepEqual(removeAB({}), {});
  t.deepEqual(removeAB({ a: { b: 'test', b1: 'kept' }, a1: 'ok' }), {
    a: { b1: 'kept' },
    a1: 'ok'
  });
});
