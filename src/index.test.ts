import test from 'ava';
import { clone, get, getOr, has, omit, pluck, remove, set } from './index';

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
  t.is(get('id', fixture), 'abf87de');
  t.is(get('id')(fixture), 'abf87de');
  t.is(get('roles', fixture), fixture.roles, 'expected reference to original');
  t.is(get('badKey', fixture), undefined);
  t.is(get('', fixture), 42);

  // Deeply nested object properties
  t.is(get('sites.github.username', fixture), 'blakek');
  t.is(get('sites.nothing.username', fixture), undefined);

  // Deeply nested array properties
  t.is(get('roles[0]', fixture), 'alert:create');
  t.is(get('roles.1', fixture), 'alert:read');

  // Special characters
  t.is(get('"with.dot"', { 'with.dot': true }), true);
  t.is(get('"with space"', { 'with space': 'yep' }), 'yep');

  // Properties set to be non-enumerable
  const withNonEnumerableProp = {};
  Object.defineProperty(withNonEnumerableProp, 'itWorks', {
    value: true,
    enumerable: false
  });
  t.is(get('itWorks', withNonEnumerableProp), true);

  // Properties on functions
  function fn() {}
  fn.member = 'member';
  t.is(get('member', fn), 'member');
});

test('getOr() gets deeply nested values with a fallback', t => {
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
  t.is(getOr('fallback', 'id', fixture), 'abf87de');
  t.is(getOr('fallback')('id')(fixture), 'abf87de');
  t.is(getOr(42, 'badKeyWithDefault', fixture), 42);

  // Deeply nested object properties
  t.is(getOr(false, 'sites.nothing.username', fixture), false);
  t.is(getOr(false, 'sites.github.username', fixture), 'blakek');

  // Deeply nested array properties
  t.is(getOr(false)('roles[1]')(fixture), 'alert:read');
  t.is(getOr('fallback', 'roles.stillnotthere', fixture), 'fallback');
  t.is(getOr('fallback', 'roles[3]', fixture), 'fallback');
  t.is(getOr('fallback')('roles.3')(fixture), 'fallback');

  // Falsy values
  t.is(getOr('fallback', 'falsyValue', { falsyValue: null }), null);
  t.is(
    getOr('fallback')('falsyValue.something')({ falsyValue: null }),
    'fallback'
  );

  // Even if the property exists, `get` should return the fallback if the value
  // is `undefined`
  t.is(
    getOr('fallback', 'definedAsUndefined', { definedAsUndefined: undefined }),
    'fallback'
  );
});

test('set() sets deeply nested values', t => {
  t.deepEqual(set('cba', 'a', { a: 'abc' }), { a: 'cba' });
  t.deepEqual(set('cba')('a')({ a: 'abc' }), { a: 'cba' });
  t.deepEqual(set(42, 'test', {}), { test: 42 });
  t.deepEqual(set('blakek', 'sites.github.username', {}), {
    sites: { github: { username: 'blakek' } }
  });
  t.deepEqual(set(123)('a.b.c')({ a: 42 }), { a: { b: { c: 123 } } });
});

test('has() returns if the path exists in an object', t => {
  const fixture: any = {
    '': 42,
    id: 'abf87de',
    roles: ['alert:create', 'alert:read'],
    sites: {
      github: {
        username: 'blakek'
      }
    },
    notDefinedButExists: undefined,
    nullish: null
  };

  t.is(has('id', fixture), true);
  t.is(has('id')(fixture), true);
  t.is(has('sites.github', fixture), true);
  t.is(has('sites.github.username', fixture), true);
  t.is(has('nothing')(fixture), false);
  t.is(has('deeply.nested.nothing', fixture), false);
  t.is(has('roles[0]')(fixture), true);
  t.is(has('', fixture), true);
  t.is(has('notDefinedButExists', fixture), true);
  t.is(has('nullish', fixture), true);
});

test('remove() removes a path from an object', t => {
  t.deepEqual(remove('', {}), {});
  t.deepEqual(remove('')({}), {});
  t.deepEqual(remove('username', { username: 'blakek' }), {});
  t.deepEqual(remove('nothing', { username: 'blakek' }), {
    username: 'blakek'
  });
  t.deepEqual(remove('deep.nothing', { username: 'blakek' }), {
    username: 'blakek'
  });
  t.deepEqual(remove('', { '': 'abc' }), {});
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

test('pluck() returns a subset of an object', t => {
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

  // Should be deeply equal, but return a new object
  t.deepEqual(pluck(['', 'id', 'roles', 'sites'], fixture), fixture);
  t.not(pluck(['', 'id', 'roles', 'sites'], fixture), fixture);
});

test('clone() returns a clone of an object', t => {
  t.deepEqual(clone({}), {});

  const o = { value: 42, nested: { again: 'yep' } };
  t.deepEqual(clone(o), o, 'failed to copy all properties');
  t.not(clone(o), o, 'returned original instead of copy');
  t.not(clone(o).nested, o.nested, 'returned original instead of copy');

  const a = [1, 2, [3, 4], { subArray: [true] }] as const;
  t.deepEqual(clone(a), a, 'failed to deeply copy array');
  t.not(clone(a), a, 'returned original instead of copy');
  t.not(clone(a)[2], a[2], 'returned original instead of copy');
  t.not(
    clone(a)[3].subArray,
    a[3].subArray,
    'returned original instead of copy'
  );

  const withFunction = {
    val: () => 'works with fn'
  } as const;
  t.deepEqual(clone(withFunction), withFunction);
  t.not(clone(withFunction).val, withFunction.val);

  const withDate = {
    val: () => new Date()
  } as const;
  t.deepEqual(clone(withDate), withDate);
  t.not(clone(withDate).val, withDate.val);
});

test('omit() returns a clone of an object with a property removed', t => {
  t.deepEqual(omit('', {}), {});
  t.deepEqual(omit('nothing', {}), {});

  const o = { value: 42, nested: { again: 'yep' } };
  t.deepEqual(omit('value', o), { nested: { again: 'yep' } });
  t.deepEqual(omit(['nested'], o), { value: 42 });
  t.deepEqual(omit(['nested', 'again'], o), { value: 42, nested: {} });

  const a = [1, 2, [3, 4], { subArray: [true] }] as const;
  t.deepEqual(omit('0', a), [undefined, 2, [3, 4], { subArray: [true] }]);
  t.deepEqual(omit('3.subArray', a), [1, 2, [3, 4], {}]);
});
