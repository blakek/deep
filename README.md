# deep

> 🐡 Get, set, remove, and test for deeply nested properties

Helps you safely work with nested properties.

Note: `set()` and `remove()` modify the passed-in object rather than creating a
copy. If you'd rather return a new object each time, there are several other
solutions ([unchanged] is really good).

## Install

Using [Yarn]:

```bash
$ yarn add @blakek/deep
```

…or using [npm]:

```bash
$ npm i --save @blakek/deep
```

## Usage

```js
import { get, has, remove, set } from '@blakek/deep';

const user = {
  id: 'abf87de',
  roles: ['alert:create', 'alert:read'],
  sites: {
    github: {
      username: 'blakek'
    }
  }
};

// Get a property value
get(user, 'sites.github.username'); // 'blakek'
get(user, 'this.does.not.exist'); // undefined
get(user, 'sites.facebook.username', 'no-account'); // 'no-account'
get(user, 'roles.0'); // 'alert:create'

// Test for a property value
has(user, 'sites.github'); // true
has(user, 'sites.twitter'); // false

// Remove a property value
remove({ a: 42, b: 123 }, 'a'); // { b: 123 }
remove({ a: 42 }, 'nothing.exists.here'); // { a: 42 }

// Set a property value
set({ a: 42 }, 'a', 123); // { a: 123 }
set({ a: 42 }, 'a.b.c', 123); // { a: { b: { c: 123 } } }
```

## API

For all these, `Path` can be a dot-notation string or array of path parts.

### `get`

```ts
function get(object: any, path?: Path, defaultValue?: any): any;
```

Gets the value for a given path with an optional fallback value.

```js
const user = {
  id: 'abf87de',
  roles: ['alert:create', 'alert:read']
};

get(user, 'roles.0'); // 'alert:create'
get(user, ['roles', 1]); // 'alert:read'
get(user, 'does.not.exist', 'fallback'); // 'fallback'
```

### `has`

```ts
function has(object: any, path: Path): boolean;
```

Returns `true` if a value was found at the given path or `false` if nothing was
found.

```js
const product = {
  id: 'abf87de',
  name: 'Logo T-Shirt',
  attributes: {
    isCool: undefined,
    materials: ['cotton']
  }
};

has(product, 'attributes.materials'); // true
has(product, ['avability', 'sizes']); // false
has(product, 'attributes.isCool'); // true (property exists but is undefined)

// `get()` should be used if you want to ensure a value is not `null` or
// `undefined`
get(product, 'attributes.isCool', false); // false
```

### `remove`

```ts
function remove(object: any, path: Path): any;
```

Removes a value at a path and returns the object.

```js
const user = {
  username: 'blakek',
  password: 'wouldntyouliketoknow'
};

remove(user, 'password'); // { username: 'blakek' }
remove(user, 'property.does.not.exist'); // { username: 'blakek' }
```

### `set`

```ts
function set(object: any, path: Path, value: any): any;
```

Sets a value at a path and returns the object.

```js
const user = {
  profile: {
    bgColor: '#639'
  }
};

set(user, 'profile.bgColor', 'tomato'); // { profile: { bgColor: 'tomato' }

set(user, 'profile.bgImage', '/images/user.png');
// { profile: { bgColor: 'tomato', bgImage: '/images/user.png' } }

set(user, 'profile', null); // { profile: null }
```

## Contributing

[Node.js] and [Yarn] are required to work with this project.

To install all dependencies, run:

```bash
yarn
```

### Useful Commands

|                     |                                                 |
| ------------------- | ----------------------------------------------- |
| `yarn build`        | Builds the project to `./dist`                  |
| `yarn format`       | Format the source following the Prettier styles |
| `yarn test`         | Run project tests                               |
| `yarn test --watch` | Run project tests, watching for file changes    |

## License

MIT

[node.js]: https://nodejs.org/
[npm]: https://npmjs.com/
[unchanged]: https://github.com/planttheidea/unchanged
[yarn]: https://yarnpkg.com/en/docs/
