import test from 'ava';
import { createPluck, pluck } from '../src';

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
  t.deepEqual(pluck([], fixture), {});

  const withId = pluck<{ id: string }>(['id'], fixture);
  t.deepEqual(withId, { id: 'abf87de' });

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

test('create a reusable pluck function', t => {
  interface User {
    username: string;
    id: string;
    sites: {
      github: {
        username: string;
      };
    };
  }

  const pluckUser = createPluck<Partial<User>>([
    'id',
    'username',
    'sites.github.username'
  ]);

  t.deepEqual(pluckUser(fixture), {
    id: fixture.id,
    sites: fixture.sites,
    username: undefined
  });
});
