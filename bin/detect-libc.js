#!/usr/bin/env node

'use strict';

const spawnSync = require('child_process').spawnSync;
const family = require('../').family;

const spawnOptions = {
  env: process.env,
  shell: true,
  stdio: 'inherit'
};

if (family && family !== 'glibc') {
  spawnOptions.env.LIBC = process.env.LIBC || family;
}

process.exit(spawnSync(process.argv[2], process.argv.slice(3), spawnOptions).status);
