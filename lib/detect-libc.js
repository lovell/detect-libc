'use strict';

var platform = require('os').platform();
var spawnSync = require('child_process').spawnSync;
var readdirSync = require('fs').readdirSync;

var GLIBC = 'glibc';
var MUSL = 'musl';

var spawnOptions = {
  encoding: 'utf8',
  env: process.env
};

function contains (needle) {
  return function (haystack) {
    return haystack.indexOf(needle) !== -1;
  };
}

var family = '';
var version = '';

if (spawnSync && platform === 'linux') {
  // Try getconf
  var glibc = spawnSync('getconf', ['GNU_LIBC_VERSION'], spawnOptions);
  if (glibc.status === 0) {
    family = GLIBC;
    version = glibc.stdout.trim().split(' ')[1];
  } else {
    // Try ldd
    var ldd = spawnSync('ldd', ['--version'], spawnOptions);
    if (ldd.status === 0 && ldd.stdout.indexOf('musl') !== -1) {
      family = MUSL;
      version = ldd.stdout.split(/[\r\n]+/)[1].trim().split(/\s/)[1];
    } else {
      // Try filesystem (family only)
      try {
        var lib = readdirSync('/lib');
        if (lib.some(contains('-linux-gnu'))) {
          family = GLIBC;
        } else if (lib.some(contains('libc.musl-'))) {
          family = MUSL;
        } else if (lib.some(contains('ld-musl-'))) {
          family = MUSL;
        }
      } catch (e) {}
    }
  }
}

var isNonGlibcLinux = (family !== '' && family !== GLIBC);

module.exports = {
  GLIBC: GLIBC,
  MUSL: MUSL,
  family: family,
  version: version,
  isNonGlibcLinux: isNonGlibcLinux
};
