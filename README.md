# deep

> 🐡 Get, set, remove, and test for deeply nested properties

Helps you safely work with nested properties.

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
import {
  clone,
  createGetter,
  get,
  has,
  omit,
  pluck,
  remove,
  set
  // also available:
  // - createHas
  // - createOmit
  // - createPluck
  // - createRemove
  // - createSetter
  // - isObject
  // - traverseObject
} from '@blakek/deep';

const user = {
  id: 'abf87de',
  roles: ['alert:create', 'alert:read'],
  sites: {
    github: {
      username: 'blakek'
    }
  }
};

// Deeply clone most values
const userCopy = clone(user);
user === userCopy; //» false
user.id === userCopy.id; //» true
user.roles === userCopy.roles; //» false
user.roles[0] === userCopy.roles[0]; //» true

// Get a property value
get('sites.github.username', user); //» 'blakek'

// Get a property value with a fallback other than `undefined`
get('sites.facebook.username', user, 'no-account'); //» 'no-account'

// Create a function to get a property value later
const getUsername = createGetter('sites.github.username');
getUsername(user); //» 'blakek'

// Test for a property value
has('sites.github', user); //» true

// Clone an object and omit properties
omit(['roles', 'sites'], user); //» { id: 'abf87de' }

// Pluck a subset of properties
pluck(['id', 'roles'], user);
//» { id: 'abf87de', roles: [ 'alert:create', 'alert:read' ] }

// Remove a property value, modifying the current object
remove('a', { a: 42, b: 123 }); //» { b: 123 }

// Set a property value, modifying the current object
set(123, 'a.b.c', { a: 42 }); //» { a: { b: { c: 123 } } }
```

## API

For all these:

- `path` can be either a dot-notation string or array of path parts

### `clone`

Returns a deep clone / deep copy of most values: primitive values, objects, arrays, Map, Set, Date, etc.

```ts
function clone<T extends unknown>(value: T): T;
```

```js
const object = { value: 'yep' };
const cloned = clone(object);

cloned === object; //» false
cloned.value === object.value; //» true
```

### `get` / `createGetter`

Gets the value for a given path with an optional fallback value.

```ts
function get(path: Path, object: object, fallbackValue?: any): unknown;

function createGetter(
  path: Path,
  fallbackValue?: any
): (object: object) => unknown;
```

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
get('sites.github.avatar.src', user, 'default.png'); //» 'default.png'

const getID = get('id');
getID(user); //» 'abf87de'

const getRoles = createGetter('roles');
getRoles(user); //» ['alert:create', 'alert:read']
```

### `has` / `createHas`

Returns `true` if a value was found at the given path or `false` if nothing was
found.

```ts
function has(path: Path, object: any): boolean;

function createHas(path: Path): (object: any) => boolean;
```

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

const hasMaterials = createHas('attributes.materials');
hasMaterials(product); //» true

// NOTE: `get()` should be used if you want to ensure a value is not `undefined`
get('attributes.isCool', product, false); //» false
```

### `omit` / `createOmit`

Returns a clone of an object with a list of properties removed.

Note: `omit()` returns a clone with properties removed. If you'd rather modify
the existing object for performance, consider using `remove()`.

```ts
function omit(properties: Path[], object: any): any;

function createOmit(properties: Path[]): (object: any) => any;
```

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

omit(['roles', 'sites'], user); //» { username: 'blakek' }
omit(['username', 'roles', 'sites.doesnt.exist'], user);
//» { sites: { github: { username: 'blakek' } } }

const omitExtra = createOmit(['roles, sites']);
omitExtra(user); //» { username: 'blakek' }
```

### `pluck` / `createPluck`

Gets a subset of properties from an object.

```ts
function pluck(properties: Path[], object: any): any;
```

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

const permissionInfo = pluck(['roles', 'username']);
permissionInfo(user); //» { roles: [ 'alert:create', 'alert:read' ], username: 'blakek' }
```

### `remove` / `createRemove`

Removes a value at a path and returns the object.

Note: `remove()` modifies the passed-in object rather than creating a copy. If
you'd rather return a new object:

- use `omit()`; `omit()` returns a clone with a list of properties removed
- use `clone()` before `remove()`
- consider another solution ([unchanged] is really good)

```ts
function remove(path: Path, object: any): any;

function createRemove(path: Path): (object: any) => any;
```

```js
const user = {
  username: 'blakek',
  password: 'wouldntyouliketoknow'
};

remove('password', user); //» { username: 'blakek' }
remove('property.does.not.exist', user);
//» { username: 'blakek' } (same object from previous line)

const removePassword = createRemove('password');
removePassword({ username: 'bob', password: 'laskjfl' }); //» { username: 'bob' }
```

### `set` / `createSetter`

Sets a value at a path and returns the object.

Note: `set()` modifies the passed-in object rather than creating a copy. If
you'd rather return a new object:

- use `clone()` before `set()`
- consider another solution ([unchanged] is really good)

```ts
function set(value: any, path: Path, object: any): any;

function createSetter(path: Path, object: any): (value: any) => any;
```

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

const setUsername = createSetter('username', user);
setUsername('blakek'); //»  { profile: { bgColor: 'tomato', bgImage: '/images/user.png' }, username: 'blakek' }
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
