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
import { get, getOr, has, pluck remove, set } from '@blakek/deep';

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
get('sites.github.username', user); //» 'blakek'

// Arguments can be partially applied
const githubUsername = get('sites.github.username');
githubUsername(user); //» 'blakek'

// Get a property value with a fallback other than `undefined`
getOr('no-account', 'sites.facebook.username', user); //» 'no-account'

// Test for a property value
has('sites.github', user); //» true

// Pluck a subset of properties
pluck(['id', 'roles'], user);
//» { id: 'abf87de', roles: [ 'alert:create', 'alert:read' ] }

// Remove a property value
remove('a', { a: 42, b: 123 }); //» { b: 123 }

// Set a property value
set(123, 'a.b.c', { a: 42 }); //» { a: { b: { c: 123 } } }
```

## API

For all these:

- `path` can be either a dot-notation string or array of path parts
- arguments can be partially applied

### `get`

```ts
function get(path: Path, object: any): any;
```

Gets the value for a given path with an optional fallback value.

```js
const user = {
  id: 'abf87de',
  roles: ['alert:create', 'alert:read'],
  sites: {
    github: {
      username: 'blakek'
    }
  }
};

get('id', user); //» 'abf87de'
get('roles.0', user); //» 'alert:create'
get('roles[0]', user); //» 'alert:create'
get(['roles', 1], user); //» 'alert:read'
get('sites.github.username', user); //» 'blakek'

const getID = get('id');
getID(user); //» 'abf87de'
```

### `getOr`

```ts
function getOr(defaultValue: any, path: Path, object: any): any;
```

Like `get`, gets a value from an object. Will return a fallback other than
`undefined` if the value was not found equal to `undefined`.

```js
const user = {
  id: 'abf87de',
  roles: ['alert:create', 'alert:read'],
  sites: {
    github: {
      username: 'blakek'
    }
  }
};

getOr('/images/placeholder.png', 'sites.github.image', user); //» '/images/placeholder.png'

const getRoles = getOr([], 'roles');
getRoles(user); //» ['alert:create', 'alert:read']
getRoles({}); //» []
```

### `has`

```ts
function has(path: Path, object: any): boolean;
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

has('attributes.materials', product); //» true
has(['avability', 'sizes'], product); //» false
has('attributes.isCool', product); //» true; property exists but is undefined

// `get()` should be used if you want to ensure a value is not `undefined`
getOr(false, 'attributes.isCool', product); //» false
```

### `remove`

```ts
function remove(path: Path, object: any): any;
```

Removes a value at a path and returns the object.

```js
const user = {
  username: 'blakek',
  password: 'wouldntyouliketoknow'
};

remove('password', user); //» { username: 'blakek' }
remove('property.does.not.exist', user);
//» { username: 'blakek' } (same object from previous line)
```

### `pluck`

```ts
function pluck(properties: Path[], object: any): any;
```

Gets a subset of properties from an object.

```js
const user = {
  username: 'blakek',
  roles: ['alert:create', 'alert:read'],
  sites: {
    github: {
      username: 'blakek'
    }
  }
};

pluck(['username'], user); //» { username: 'blakek' }
pluck(['username', 'roles'], user);
//» { username: 'blakek', roles: [ 'alert:create', 'alert:read' ] }
```

### `set`

```ts
function set(value: any, path: Path, object: any): any;
```

Sets a value at a path and returns the object.

```js
const user = {
  profile: {
    bgColor: '#639'
  }
};

set('tomato', 'profile.bgColor', user); //» { profile: { bgColor: 'tomato' } }

set('/images/user.png', 'profile.bgImage', user);
//» { profile: { bgColor: 'tomato', bgImage: '/images/user.png' } }

const logout = set(null, 'profile');
logout(user); //» { profile: null }
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
