#!/usr/bin/env node

'use strict';

const spawnSync = require('child_process').spawnSync;
const family = require('../').family;

const spawnOptions = { stdio: 'inherit', env: process.env };
if (family) {
  spawnOptions.env.LIBC = family;
}

spawnSync(process.argv[2], process.argv.slice(3), spawnOptions);
