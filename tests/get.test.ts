import test from 'ava';
import { createGet, get } from '../src';

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

test('gets property values', t => {
  const id = get<string>('id', fixture);
  t.is(id, 'abf87de');

  t.is(get('roles', fixture), fixture.roles, 'expected reference to original');
  t.is(get('badKey', fixture), undefined);
  t.is(get('', fixture), 42);
});

test('gets deeply nested object values', t => {
  const username = get<string>('sites.github.username', fixture);

  t.is(username, 'blakek');
  t.is(get('sites.nothing.username', fixture), undefined);
});

test('gets deeply nested array values', t => {
  t.is(get('roles[0]', fixture), 'alert:create');
  t.is(get('roles.1', fixture), 'alert:read');
  t.is(get(['roles', 1], fixture), 'alert:read');

  t.is(get('roles[1]', fixture, false), 'alert:read');
  t.is(get('roles.stillnotthere', fixture, 'fallback'), 'fallback');
  t.is(get('roles[3]', fixture, 'fallback'), 'fallback');
  t.is(get('roles.3', fixture, 'fallback'), 'fallback');
});

test('handles special characters', t => {
  t.is(get('"with.dot"', { 'with.dot': true }), true);
  t.is(get('"with space"', { 'with space': 'yep' }), 'yep');
});

test('handles properties that are set to be non-enumerable', t => {
  const withNonEnumerableProp = {};
  Object.defineProperty(withNonEnumerableProp, 'itWorks', {
    value: true,
    enumerable: false
  });
  t.is(get('itWorks', withNonEnumerableProp), true);
});

test('gets properties on functions', t => {
  function fn() {}
  fn.member = 'member';
  t.is(get('member', fn), 'member');
});

test('gets values with a fallback', t => {
  const id = get<string>('id', fixture, 'fallback');
  t.is(id, 'abf87de');

  const key = get<number>('badKeyWithDefault', fixture, 42);
  t.is(key, 42);
});

test('gets deeply nested object values with a fallback', t => {
  t.is(get('sites.nothing.username', fixture, false), false);
  t.is(get('sites.github.username', fixture, false), 'blakek');
});

test('correctly handles falsy values', t => {
  t.is(get('falsyValue', { falsyValue: null }, 'fallback'), null);
  t.is(get('falsyValue', { falsyValue: false }, 'fallback'), false);
  t.is(get('falsyValue', { falsyValue: 0 }, 'fallback'), 0);

  t.is(
    get('falsyValue.something', { falsyValue: null }, 'fallback'),
    'fallback'
  );
});

test('returns fallback if the value is undefined', t => {
  t.is(
    get('definedAsUndefined', { definedAsUndefined: undefined }, 'fallback'),
    'fallback'
  );
});

test('create a reusable get function', t => {
  const getUsername = createGet<string>('sites.github.username');

  t.is(getUsername(fixture), 'blakek');
  t.is(getUsername({}), undefined);

  const getNumber = createGet('number', 0);
  t.is(getNumber({}), 0);
  t.is(getNumber({ number: 42 }), 42);
});
