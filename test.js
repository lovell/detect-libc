'use strict';

const ava = require('ava');
const proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

ava('linux glibc is detected', function (t) {
  t.plan(5);

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

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is(libc.GLIBC, libc.family);
  t.is('1.23', libc.version);
  t.false(libc.isNonGlibcLinux);
});

ava('linux musl is detected', function (t) {
  t.plan(5);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'linux';
      }
    },
    child_process: {
      spawnSync: function (command) {
        return command === 'getconf' ? {
          status: 64,
          stdout: 'getconf: GNU_LIBC_VERSION: unknown variable\n'
        } : {
          status: 0,
          stdout: 'musl libc (x86_64)\nVersion 1.2.3\nDynamic Program Loader\nUsage: ldd [options] [--] pathname'
        };
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is(libc.MUSL, libc.family);
  t.is('1.2.3', libc.version);
  t.true(libc.isNonGlibcLinux);
});

ava('darwin is ignored', function (t) {
  t.plan(5);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'darwin';
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is('', libc.family);
  t.is('', libc.version);
  t.false(libc.isNonGlibcLinux);
});

ava('win32 is ignored', function (t) {
  t.plan(5);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'win32';
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is('', libc.family);
  t.is('', libc.version);
  t.false(libc.isNonGlibcLinux);
});
