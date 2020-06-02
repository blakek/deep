import test from 'ava';
import { get, has, set } from './index';

test('get() gets deeply nested values', t => {
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

  // Basic functionality
  t.is(get(fixture, 'id'), 'abf87de');
  t.is(get(fixture, 'id', 'fallback'), 'abf87de');
  t.is(get(fixture, 'roles'), fixture.roles, 'expected reference to original');
  t.is(get(fixture, 'badKey'), undefined);
  t.is(get(fixture, 'badKeyWithDefault', 42), 42);
  t.is(get(fixture, ''), 42);

  // Deeply nested object properties
  t.is(get(fixture, 'sites.github.username'), 'blakek');
  t.is(get(fixture, 'sites.nothing.username'), undefined);
  t.is(get(fixture, 'sites.nothing.username', false), false);

  // Deeply nested array properties
  t.is(get(fixture, 'roles[0]'), 'alert:create');
  t.is(get(fixture, 'roles[1]', false), 'alert:read');
  t.is(get(fixture, 'roles.1'), 'alert:read');
  t.is(get(fixture, 'roles[3]', 'fallback'), 'fallback');
  t.is(get(fixture, 'roles.3', 'fallback'), 'fallback');
  t.is(get(fixture, 'roles.stillnotthere', 'fallback'), 'fallback');

  // Special characters
  t.is(get({ 'with.dot': true }, '"with.dot"'), true);
  t.is(get({ 'with space': 'yep' }, '"with space"'), 'yep');

  // Falsy values
  t.is(get({ falsyValue: null }, 'falsyValue', 'fallback'), null);
  t.is(
    get({ falsyValue: null }, 'falsyValue.something', 'fallback'),
    'fallback'
  );
  t.is(
    get({ definedAsUndefined: undefined }, 'definedAsUndefined', 'fallback'),
    undefined
  );

  // Properties set to be non-enumerable
  const withNonEnumerableProp = {};
  Object.defineProperty(withNonEnumerableProp, 'itWorks', {
    value: true,
    enumerable: false
  });
  t.is(get(withNonEnumerableProp, 'itWorks'), true);

  // Properties on functions
  function fn() {}
  fn.member = 'member';
  t.is(get(fn, 'member'), 'member');
});

test('set() sets deeply nested values', t => {
  t.deepEqual(set({ a: 'abc' }, 'a', 'cba'), { a: 'cba' });
  t.deepEqual(set({}, 'test', 42), { test: 42 });
  t.deepEqual(set({}, 'sites.github.username', 'blakek'), {
    sites: { github: { username: 'blakek' } }
  });
});

test('has() returns if the path exists in an object', t => {
  const fixture = {
    '': 42,
    id: 'abf87de',
    roles: ['alert:create', 'alert:read'],
    sites: {
      github: {
        username: 'blakek'
      }
    }
  };

  t.is(has(fixture, 'id'), true);
  t.is(has(fixture, 'sites.github'), true);
  t.is(has(fixture, 'sites.github.username'), true);
  t.is(has(fixture, 'deeply.nested.nothing'), false);
  t.is(has(fixture, 'roles[0]'), true);
  t.is(has(fixture, ''), true);
});
