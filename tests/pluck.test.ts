import test from 'ava';
import { pluck } from '../src';

const fixture = {
  // Test edge case of empty-string key
  '': 42,
  id: 'abf87de',
  roles: ['alert:create', 'alert:read'],
  sites: {
    github: {
      username: 'blakek'
    }
  }
};

test('returns a subset of an object', t => {
  t.deepEqual(pluck([], {}), {});
  t.deepEqual(pluck([])(fixture), {});
  t.deepEqual(pluck(['id'])(fixture), { id: 'abf87de' });
  t.deepEqual(pluck(['id', 'roles'], fixture), {
    id: 'abf87de',
    roles: ['alert:create', 'alert:read']
  });
  t.deepEqual(pluck(['sites.github.username'], fixture), {
    sites: { github: { username: 'blakek' } }
  });
});

test('returns new shallow reference', t => {
  t.deepEqual(pluck(['', 'id', 'roles', 'sites'], fixture), fixture);
  t.not(pluck(['', 'id', 'roles', 'sites'], fixture), fixture);
});
