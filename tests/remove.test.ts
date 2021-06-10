import test from 'ava';
import { remove } from '../src';

test('removes a path from an object', t => {
  t.deepEqual(remove('', {}), {});
  t.deepEqual(remove('')({}), {});
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
  t.deepEqual(
    remove('value.2.isCool', {
      value: [1, 2, { isCool: true }]
    }),
    { value: [1, 2, {}] }
  );
  t.deepEqual(
    remove('value.2.isCool')({
      value: [1, 2, { isCool: true }]
    }),
    { value: [1, 2, {}] }
  );
});

test('handles empty-string key', t => {
  t.deepEqual(remove('', { '': 'abc', v: [1] }), { v: [1] });
});
