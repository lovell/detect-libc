# detect-libc

Node.js module to detect the C standard library (libc) implementation
family and version in use on a given system.

Provides a value suitable for use with the `libc` option of
[prebuild](https://www.npmjs.com/package/prebuild),
[prebuild-ci](https://www.npmjs.com/package/prebuild-ci) and
[prebuild-install](https://www.npmjs.com/package/prebuild-install),
therefore allowing build and provision of pre-compiled binaries
for musl-based Linux e.g. Alpine as well as glibc-based.

Currently supports libc detection on Linux (glibc, musl) and OS X (bsd).

## Install

```sh
npm install detect-libc
```

## Usage

### detect-libc command

Command line tool that spawns the child `command` with the `LIBC`
environment variable set to the value of the system libc family.

### API

```js
const { family, version } = require('detect-libc');
```

* `family` is a String representing the system's libc family.
* `version` is a String representing the system's libc version.

## Integrating with prebuild

```json
  "scripts": {
    "install": "detect-libc prebuild-install || node-gyp rebuild",
    "test": "mocha && detect-libc prebuild-ci"
  },
  "dependencies": {
    "detect-libc": "^0.0.5",
    "prebuild-install": "^2.1.2"
  },
  "devDependencies": {
    "prebuild": "^6.2.0",
    "prebuild-ci": "^2.2.2"
  }
```

## Licence

Copyright 2017 Lovell Fuller

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
