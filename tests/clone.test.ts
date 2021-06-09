import test from 'ava';
import { clone } from '../src';

test('deeply clones an object', t => {
  t.deepEqual(clone({}), {});

  const o = { value: 42, nested: { again: 'yep' } };
  t.deepEqual(clone(o), o, 'failed to copy all properties');
  t.not(clone(o), o, 'returned original instead of copy');
  t.not(clone(o).nested, o.nested, 'returned original instead of copy');
});

test('deeply clones an array', t => {
  const a = [1, 2, [3, 4], { subArray: [true] }] as const;
  t.deepEqual(clone(a), a, 'failed to deeply copy array');
  t.not(clone(a), a, 'returned original instead of copy');
  t.not(clone(a)[2], a[2], 'returned original instead of copy');
  t.not(
    clone(a)[3].subArray,
    a[3].subArray,
    'returned original instead of copy'
  );
});

test('works with primitive values', t => {
  t.is(clone(123), 123);
  t.is(clone('test'), 'test');
  t.is(clone(true), true);
  t.is(clone(false), false);
  t.is(clone(undefined), undefined);
  t.is(clone(5n), 5n);

  const symbol = Symbol('symbol test');
  t.is(clone(symbol), symbol);
});

test('clones Dates', t => {
  const d = new Date();
  t.deepEqual(clone(d), d);
  t.not(clone(d), d);

  const withDate = {
    value: new Date()
  } as const;

  t.deepEqual(clone(withDate), withDate);
  t.not(clone(withDate).value, withDate.value);
});

test('clones regular expressions', t => {
  const regExp = /works/i;
  t.deepEqual(clone(regExp), regExp);
  t.not(clone(regExp), regExp);

  const withRegExp = { value: regExp } as const;

  t.deepEqual(clone(withRegExp), withRegExp);
  t.not(clone(withRegExp).value, withRegExp.value);
});

test('handles null', t => {
  t.is(clone(null), null);

  t.deepEqual(clone({ a: null }), { a: null });
  t.not(clone({ a: null }), { a: null });
  t.is(clone({ a: null }.a), null);
});

test.failing('clones Sets', t => {
  const s = new Set([1, 3, 5]);
  t.deepEqual(clone(s), s);
  t.not(clone(s), s);

  const withSet = { value: s } as const;

  t.deepEqual(clone(withSet), withSet);
  t.not(clone(withSet).value, withSet.value);
});

test.failing('clones Maps', t => {
  const m = new Map([['works', true]]);
  t.deepEqual(clone(m), m);
  t.not(clone(m), m);

  const withMap = { value: m } as const;

  t.deepEqual(clone(withMap), withMap);
  t.not(clone(withMap).value, withMap.value);
});

test('retains functions', t => {
  const withFunction = {
    val: () => 'works with fn'
  } as const;
  t.deepEqual(clone(withFunction), withFunction);
});
