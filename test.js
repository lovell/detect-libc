'use strict';

const ava = require('ava');
const proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

ava('linux glibc is detected', function (t) {
  t.plan(6);

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
  t.is('getconf', libc.method);
  t.false(libc.isNonGlibcLinux);
});

ava('linux musl is detected via ldd exit 0', function (t) {
  t.plan(6);

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
  t.is('ldd', libc.method);
  t.true(libc.isNonGlibcLinux);
});

ava('linux musl is detected via ldd exit 1', function (t) {
  t.plan(6);

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
          status: 1,
          stderr: 'musl libc (x86_64)\nVersion 1.2.3\nDynamic Program Loader\nUsage: ldd [options] [--] pathname'
        };
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is(libc.MUSL, libc.family);
  t.is('1.2.3', libc.version);
  t.is('ldd', libc.method);
  t.true(libc.isNonGlibcLinux);
});

ava('darwin is ignored', function (t) {
  t.plan(6);

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
  t.is('', libc.method);
  t.false(libc.isNonGlibcLinux);
});

ava('win32 is ignored', function (t) {
  t.plan(6);

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
  t.is('', libc.method);
  t.false(libc.isNonGlibcLinux);
});

ava('Linux detect glibc from /lib filesystem', function (t) {
  t.plan(6);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'linux';
      }
    },
    child_process: {
      spawnSync: function () {
        return { status: -1 };
      }
    },
    fs: {
      readdirSync: function () {
        return ['init', 'modprobe.d', 'modules', 'resolvconf', 'systemd', 'udev', 'x86_64-linux-gnu', 'xtables'];
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is(libc.GLIBC, libc.family);
  t.is('', libc.version);
  t.is('filesystem', libc.method);
  t.false(libc.isNonGlibcLinux);
});

ava('Linux detect glibc from /usr filesystem', function (t) {
  t.plan(6);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'linux';
      }
    },
    child_process: {
      spawnSync: function () {
        return { status: -1 };
      }
    },
    fs: {
      readdirSync: function (path) {
        return path === '/usr/sbin' ? ['glibc-post-wrapper'] : [];
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is(libc.GLIBC, libc.family);
  t.is('', libc.version);
  t.is('filesystem', libc.method);
  t.false(libc.isNonGlibcLinux);
});

ava('Linux detect musl from filesystem', function (t) {
  t.plan(6);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'linux';
      }
    },
    child_process: {
      spawnSync: function () {
        return { status: -1 };
      }
    },
    fs: {
      readdirSync: function () {
        return ['apk', 'firmware', 'ld-musl-x86_64.so.1', 'libc.musl-x86_64.so.1', 'libz.so.1', 'libz.so.1.2.11', 'mdev'];
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is(libc.MUSL, libc.family);
  t.is('', libc.version);
  t.is('filesystem', libc.method);
  t.true(libc.isNonGlibcLinux);
});

ava('NodeOS detect musl from filesystem', function (t) {
  t.plan(6);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'linux';
      }
    },
    child_process: {
      spawnSync: function () {
        return { status: -1 };
      }
    },
    fs: {
      readdirSync: function () {
        return ['ld-musl-x86_64.so.1', 'libc.so', 'libfuse.so', 'libfuse.so.2', 'libfuse.so.2.9.7', 'libgcc_s.so.1', 'libstdc++.so.6', 'libstdc++.so.6.0.21', 'node_modules'];
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is(libc.MUSL, libc.family);
  t.is('', libc.version);
  t.is('filesystem', libc.method);
  t.true(libc.isNonGlibcLinux);
});

ava('Linux fail to detect from filesystem', function (t) {
  t.plan(6);

  const libc = proxyquire('./', {
    os: {
      platform: function () {
        return 'linux';
      }
    },
    child_process: {
      spawnSync: function () {
        return { status: -1 };
      }
    },
    fs: {
      readdirSync: function () {
        return [];
      }
    }
  });

  t.is('glibc', libc.GLIBC);
  t.is('musl', libc.MUSL);
  t.is('', libc.family);
  t.is('', libc.version);
  t.is('', libc.method);
  t.false(libc.isNonGlibcLinux);
});
