import test from 'ava';
import { getOr } from '../src';

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

test('gets values with a fallback', t => {
  t.is(getOr('fallback', 'id', fixture), 'abf87de');
  t.is(getOr(42, 'badKeyWithDefault', fixture), 42);
});

test('gets deeply nested object values with a fallback', t => {
  t.is(getOr(false, 'sites.nothing.username', fixture), false);
  t.is(getOr(false, 'sites.github.username', fixture), 'blakek');
});

test('gets deeply nested array values', t => {
  t.is(getOr(false, 'roles[1]', fixture), 'alert:read');
  t.is(getOr('fallback', 'roles.stillnotthere', fixture), 'fallback');
  t.is(getOr('fallback', 'roles[3]', fixture), 'fallback');
  t.is(getOr('fallback', 'roles.3', fixture), 'fallback');
});

test('correctly handles falsy values', t => {
  t.is(getOr('fallback', 'falsyValue', { falsyValue: null }), null);
  t.is(
    getOr('fallback', 'falsyValue.something', { falsyValue: null }),
    'fallback'
  );
});

test('returns fallback if the value is undefined', t => {
  t.is(
    getOr('fallback', 'definedAsUndefined', { definedAsUndefined: undefined }),
    'fallback'
  );
});
