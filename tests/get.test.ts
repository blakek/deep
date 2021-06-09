import test from 'ava';
import { get } from '../src';

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
  t.is(get('id', fixture), 'abf87de');
  t.is(get('id')(fixture), 'abf87de');
  t.is(get('roles', fixture), fixture.roles, 'expected reference to original');
  t.is(get('badKey', fixture), undefined);
  t.is(get('', fixture), 42);
});

test('gets deeply nested object values', t => {
  t.is(get('sites.github.username', fixture), 'blakek');
  t.is(get('sites.nothing.username', fixture), undefined);
});

test('gets deeply nested array values', t => {
  t.is(get('roles[0]', fixture), 'alert:create');
  t.is(get('roles.1', fixture), 'alert:read');
  t.is(get(['roles', 1], fixture), 'alert:read');
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
