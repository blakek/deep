# Universal TypeScript Starter

> Write JavaScript and TypeScript interchangeably for Node.js and browsers

This is meant as a base for standalone JavaScript/TypeScript libraries. It can
be used to write server-side Node.js libraries, CLI tools, libraries for running
in the browser.

## How to Use

This is an example repository that is ready to be set up. With [Yarn] installed,
run:

```bash
yarn create gsandf-project --example universal-typescript new-project-name
```

This creates a new project in the current directory called `new-project-name`.

## Getting Started

[Node.js] and [Yarn] are required to work with this project.

To install all dependencies, run:

```bash
yarn
```

Then, you can start the test server to get started:

```bash
yarn test --watch
```

Alternatively, you can write your own `yarn start` script depending on what's
being written.

See below for other scripts.

### Useful Commands

|                     |                                                 |
| ------------------- | ----------------------------------------------- |
| `yarn build`        | Builds the project to `./dist`                  |
| `yarn format`       | Format the source following the Prettier styles |
| `yarn test`         | Run project tests                               |
| `yarn test --watch` | Run project tests, watching for file changes    |

## License

UNLICENSED

[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.com/en/docs/
