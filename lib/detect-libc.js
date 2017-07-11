'use strict';

const platform = require('os').platform();
const spawnSync = require('child_process').spawnSync;

const spawnOptions = {
  encoding: 'utf8',
  env: process.env
};

let family = '';
let version = '';

if (platform === 'linux') {
  // Try getconf
  const glibc = spawnSync('getconf', ['GNU_LIBC_VERSION'], spawnOptions);
  if (glibc.status === 0) {
    family = 'glibc';
    version = glibc.stdout.trim().split(' ')[1];
  } else {
    // Try ldd
    const ldd = spawnSync('ldd', ['--version'], spawnOptions);
    if (ldd.status === 0) {
      if (ldd.stdout.indexOf('musl') !== -1) {
        family = 'musl';
        version = ldd.stdout.split(/[\r\n]+/)[1].trim().split(/\s/)[1];
      }
    }
  }
}

module.exports = {
  family: family,
  version: version
};
