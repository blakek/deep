import test from 'ava';
import { has } from '../src';

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

test('returns if the path exists in an object', t => {
  t.is(has('id', fixture), true);
  t.is(has('id')(fixture), true);
  t.is(has('sites.github', fixture), true);
  t.is(has('sites.github.username', fixture), true);
  t.is(has('nothing')(fixture), false);
  t.is(has('deeply.nested.nothing', fixture), false);
  t.is(has('roles[0]')(fixture), true);
  t.is(has('notDefinedButExists', fixture), true);
  t.is(has('nullish', fixture), true);
});

test('handles empty-string key', t => {
  t.is(has('', fixture), true);
});
