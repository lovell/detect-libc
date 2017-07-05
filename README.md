# detect-libc

Node.js module to detect the C standard library (libc) implementation
family and version in use on a given system.

Provides a value suitable for use with the `--libc` option of
[prebuild](https://www.npmjs.com/package/prebuild),
[prebuild-ci](https://www.npmjs.com/package/prebuild-ci) and
[prebuild-install](https://www.npmjs.com/package/prebuild-install),
therefore allowing build and provision of pre-compiled binaries
for musl-based Linux e.g. Alpine as well as glibc-based.

Currently supports Linux (glibc, musl) and OS X (bsd).

## Install

```sh
npm install detect-libc
```

## Usage

### detect-libc-family

Prints the libc family e.g. "glibc" or "musl" to stdout.

### detect-libc-version

Prints the libc version e.g. "1.23" to stdout.

### API

```js
const { family, version } = require('detect-libc');
```

* `family` is a String containing the system's libc family.
* `version` is a String representing the system's libc version.

## Example package.json

```json
  "scripts": {
    "install": "prebuild-install --libc `detect-libc-family` || node-gyp rebuild",
    "test": "mocha && prebuild-ci --libc `detect-libc-family`"
  ",
  "dependencies": {
    "detect-libc": "^0.0.3",
    "prebuild-install": "^2.1.2"
  },
  "devDependencies": {
    "prebuild": "^6.2.0",
    "prebuild-ci": "^2.2.2"
  }
```
