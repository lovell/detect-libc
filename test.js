'use strict';

const ava = require('ava');
const proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

ava('linux glibc', function (t) {
  t.plan(2);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'linux';
      }
    },
    child_process: {
      spawnSync: function () {
        return {
          status: 0,
          stdout: 'glibc 1.23\n'
        };
      }
    }
  });

  t.is('glibc', libc.family);
  t.is('1.23', libc.version);
});

ava('linux musl', function (t) {
  t.plan(2);

  const libc = proxyquire('./', {
    child_process: {
      os: {
        platform: function () {
          return 'linux';
        }
      },
      spawnSync: function (command) {
        return command.indexOf('getconf') !== -1 ? {
          status: 64,
          stdout: 'getconf: GNU_LIBC_VERSION: unknown variable\n'
        } : {
          status: 0,
          stdout: 'musl libc (x86_64)\nVersion 1.2.3\nDynamic Program Loader\nUsage: ldd [options] [--] pathname'
        };
      }
    }
  });

  t.is('musl', libc.family);
  t.is('1.2.3', libc.version);
});

ava('darwin bsd', function (t) {
  t.plan(2);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'darwin';
      }
    },
    child_process: {
      spawnSync: function () {
        return {
          status: 0,
          stdout: '/usr/lib/libc.dylib:\n  /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1000.20.3)\n...'
        };
      }
    }
  });

  t.is('bsd', libc.family);
  t.is('1000.20.3', libc.version);
});

ava('darwin without otool', function (t) {
  t.plan(2);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'darwin';
      }
    },
    child_process: {
      spawnSync: function () {
        return {
          status: 127,
          stdout: '-bash: otool: command not found'
        };
      }
    }
  });

  t.is('', libc.family);
  t.is('', libc.version);
});
