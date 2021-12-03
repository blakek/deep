import test from 'ava';
import { createSetter, set } from '../src';

test('sets deeply nested values', t => {
  t.deepEqual(set('cba', 'a', { a: 'abc' }), { a: 'cba' });
  t.deepEqual(set(42, 'test', {}), { test: 42 });
  t.deepEqual(set('blakek', 'sites.github.username', {}), {
    sites: { github: { username: 'blakek' } }
  });
  t.deepEqual(set(123, 'a.b.c', { a: 42 }), { a: { b: { c: 123 } } });
});

test('create a reusable set function', t => {
  interface WithGithub {
    sites: { github: { username: string } };
  }

  const fixture = {} as any;

  const setUsername = createSetter<string, WithGithub>(
    'sites.github.username',
    fixture
  );

  t.deepEqual(fixture, {});

  setUsername('blakek');

  t.deepEqual(fixture, { sites: { github: { username: 'blakek' } } });
});
