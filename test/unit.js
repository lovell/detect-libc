// Copyright 2017 Lovell Fuller and others.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const test = require('ava');
const path = require('path');
const proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

const filePermissionError = new Error('Read error');
filePermissionError.code = 'ERR_ACCESS_DENIED';

test('filesystem - file found', async (t) => {
  t.plan(2);

  const filesystem = require('../lib/filesystem');
  const notExistFile = path.join(__dirname, './non-exist.txt');

  try {
    await filesystem.readFile(notExistFile);
  } catch (e) {
    t.true(e instanceof Error);
  }

  try {
    filesystem.readFileSync(notExistFile);
  } catch (e) {
    t.true(e instanceof Error);
  }
});

test('filesystem - file not found', async (t) => {
  t.plan(2);

  const filesystem = require('../lib/filesystem');
  const testFixtureFilePath = path.join(__dirname, './test-fixture.txt');

  t.is(await filesystem.readFile(testFixtureFilePath), '1');
  t.is(filesystem.readFileSync(testFixtureFilePath), '1');
});

test('constants', (t) => {
  t.plan(2);

  const libc = require('../');

  t.is(libc.GLIBC, 'glibc');
  t.is(libc.MUSL, 'musl');
});

test('linux - glibc family detected via ldd', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFile: () => Promise.resolve('# This file is part of the GNU C Library.')
    }
  });

  t.is(await libc.family(), libc.GLIBC);
  t.false(await libc.isNonGlibcLinux());
});

test('linux - glibc familySync detected via ldd', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFileSync: () => '# The GNU C Library is free software; you can redistribute it and/or'
    }
  });

  t.is(libc.familySync(), libc.GLIBC);
  t.false(libc.isNonGlibcLinuxSync());
});

test('linux - glibc family detected via ldd on error fallback', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        header: {
          glibcVersionRuntime: '1.23'
        }
      })
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError)
    }
  });

  t.is(await libc.family(), libc.GLIBC);
  t.false(await libc.isNonGlibcLinux());
});

test('linux - glibc familySync detected via ldd on error fallback', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        header: {
          glibcVersionRuntime: '1.23'
        }
      })
    },
    './filesystem': {
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(libc.familySync(), libc.GLIBC);
  t.false(libc.isNonGlibcLinuxSync());
});

test('linux - glibc family and version detected via report', async (t) => {
  t.plan(3);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        header: {
          glibcVersionRuntime: '1.23'
        }
      })
    },
    './filesystem': {
      readFile: () => Promise.resolve('bunch-of-text')
    }
  });

  t.is(await libc.family(), libc.GLIBC);
  t.is(await libc.version(), '1.23');
  t.false(await libc.isNonGlibcLinux());
});

test('linux - glibc familySync and version detected via report', async (t) => {
  t.plan(3);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        header: {
          glibcVersionRuntime: '1.23'
        }
      })
    },
    './filesystem': {
      readFileSync: () => 'bunch-of-text'
    }
  });

  t.is(libc.familySync(), libc.GLIBC);
  t.is(libc.versionSync(), '1.23');
  t.false(libc.isNonGlibcLinuxSync());
});

test('linux - musl family detected via ldd', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFile: () => Promise.resolve('bunch-of-text-musl')
    }
  });

  t.is(await libc.family(), libc.MUSL);
  t.true(await libc.isNonGlibcLinux());
});

test('linux - musl familySync detected via ldd', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFileSync: () => 'bunch-of-text-musl'
    }
  });

  t.is(libc.familySync(), libc.MUSL);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - musl family fallback when not found ldd', async (t) => {
  t.plan(2);

  const someError = new Error('Some error');

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        sharedObjects: ['/lib/ld-musl-x86_64.so.1']
      })
    },
    './filesystem': {
      readFile: () => Promise.reject(someError)
    }
  });

  t.is(await libc.family(), libc.MUSL);
  t.true(await libc.isNonGlibcLinux());
});

test('linux - musl familySync fallback when not found ldd', async (t) => {
  t.plan(2);

  const someError = new Error('Some error');

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        sharedObjects: ['/lib/ld-musl-x86_64.so.1']
      })
    },
    './filesystem': {
      readFileSync: () => {
        throw someError;
      }
    }
  });

  t.is(libc.familySync(), libc.MUSL);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - musl family detected via report', async (t) => {
  t.plan(4);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        sharedObjects: ['/lib/ld-musl-x86_64.so.1']
      })
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError),
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(await libc.family(), libc.MUSL);
  t.true(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), libc.MUSL);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - glibc family detected via async child process', async (t) => {
  t.plan(2);

  const out = 'glibc 1.23\nldd (GLIBC) 1.23\nCopyright\netc';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out)
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError),
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(await libc.family(), libc.GLIBC);
  t.false(await libc.isNonGlibcLinux());
});

test('linux - glibc family detected via sync child process', async (t) => {
  t.plan(2);

  const out = 'glibc 1.23\nldd (GLIBC) 1.23\nCopyright\netc';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      execSync: () => out
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError),
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(libc.familySync(), libc.GLIBC);
  t.false(libc.isNonGlibcLinuxSync());
});

test('linux - musl family detected via async child process', async (t) => {
  t.plan(2);

  const out = 'getconf: GNU_LIBC_VERSION: unknown variable\nmusl libc\nVersion 1.2.3\netc';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        sharedObjects: []
      })
    },
    child_process: {
      exec: (_c, cb) => cb(null, out)
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError),
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(await libc.family(), libc.MUSL);
  t.true(await libc.isNonGlibcLinux());
});

test('linux - musl family detected via sync child process', async (t) => {
  t.plan(2);

  const out = 'getconf: GNU_LIBC_VERSION: unknown variable\nmusl libc\nVersion 1.2.3\netc';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        sharedObjects: []
      })
    },
    child_process: {
      execSync: () => out
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError),
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(libc.familySync(), libc.MUSL);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - unknown family', async (t) => {
  t.plan(4);

  const out = 'unknown';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError),
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(await libc.family(), null);
  t.true(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), null);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - unknown family (exec fails)', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(new Error())
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError),
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(await libc.family(), null);
  t.true(await libc.isNonGlibcLinux());
});

test('linux - unknown family (execSync fails)', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      execSync: () => { throw new Error(); }
    },
    './filesystem': {
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(libc.familySync(), null);
  t.true(libc.isNonGlibcLinuxSync());
});

test('non-linux - unknown family', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => false
    }
  });

  t.is(await libc.family(), null);
  t.false(await libc.isNonGlibcLinux());
});

test('non-linux - unknown familySync', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => false
    }
  });

  t.is(libc.familySync(), null);
  t.false(libc.isNonGlibcLinuxSync());
});

// version

test('linux - glibc version detected via filesystem', async (t) => {
  t.plan(1);

  const out = '--vers | --versi | --versio | --version)\necho \'ldd (Ubuntu GLIBC 1.23-0ubuntu9.9) 1.23\'';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFile: () => Promise.resolve(out)
    }
  });

  t.is(await libc.version(), '1.23');
});

test('linux - glibc version detected via filesystem (libc)', async (t) => {
  t.plan(1);

  const out = '--vers | --versi | --versio | --version)\necho \'ldd (GNU libc) 2.39\'';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFile: () => Promise.resolve(out)
    }
  });

  t.is(await libc.version(), '2.39');
});

test('linux - libc version not detected via filesystem (void linux musl)', async (t) => {
  t.plan(1);

  const out = 'startlibc_startGNU AS 2.35.1';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    './filesystem': {
      readFile: () => Promise.resolve(out)
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(await libc.version(), null);
});

test('linux - glibc version detected via filesystemSync', async (t) => {
  t.plan(1);

  const out = '--vers | --versi | --versio | --version)\necho \'ldd (Ubuntu GLIBC 1.23-0ubuntu9.9) 1.23\'';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFileSync: () => out
    }
  });

  t.is(libc.versionSync(), '1.23');
});

test('linux - glibc version detected via filesystemSync (libc)', async (t) => {
  t.plan(1);

  const out = '--vers | --versi | --versio | --version)\necho \'ldd (GNU libc) 2.39\'';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true
    },
    './filesystem': {
      readFileSync: () => out
    }
  });

  t.is(libc.versionSync(), '2.39');
});

test('linux - libc version not detected via filesystemSync (void linux musl)', (t) => {
  t.plan(1);

  const out = 'startlibc_startGNU AS 2.35.1';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    './filesystem': {
      readFile: () => Promise.resolve(out)
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(libc.versionSync(), null);
});

test('linux - glibc version detected via child process', async (t) => {
  t.plan(1);

  const out = 'glibc 1.23\nldd (GLIBC) 1.23\nCopyright\netc';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    },
    './filesystem': {
      readFile: () => Promise.reject(filePermissionError)
    }
  });

  t.is(await libc.version(), '1.23');
});

test('linux - glibc version detected via child process sync', async (t) => {
  t.plan(1);

  const out = 'glibc 1.23\nldd (GLIBC) 1.23\nCopyright\netc';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      execSync: () => out
    },
    './filesystem': {
      readFileSync: () => {
        throw filePermissionError;
      }
    }
  });

  t.is(libc.versionSync(), '1.23');
});

test('linux - musl version detected via child process', async (t) => {
  t.plan(4);

  const out = 'getconf: GNU_LIBC_VERSION: unknown variable\nmusl libc\nVersion 1.2.3\netc';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    },
    './filesystem': {
      readFile: () => Promise.resolve('does not have version')
    }
  });

  t.is(await libc.version(), '1.2.3');
  t.is(libc.versionSync(), '1.2.3');

  // calling twice to check the cache
  t.is(await libc.version(), '1.2.3');
  t.is(libc.versionSync(), '1.2.3');
});

test('linux - unknown version', async (t) => {
  t.plan(2);

  const out = 'unknown';
  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    },
    './filesystem': {
      readFile: () => Promise.resolve('does not have version')
    }
  });

  t.is(await libc.version(), null);
  t.is(libc.versionSync(), null);
});

test('linux - unknown version (exec fails)', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(new Error()),
      execSync: () => { throw new Error(); }
    },
    './filesystem': {
      readFile: () => Promise.resolve('does not have version')
    }
  });

  t.is(await libc.version(), null);
  t.is(libc.versionSync(), null);
});

test('non-linux - unknown version', async (t) => {
  t.plan(2);

  const libc = proxyquire('../', {
    './process': {
      isLinux: () => false
    }
  });

  t.is(await libc.version(), null);
  t.is(libc.versionSync(), null);
});

test('process (internal)', (t) => {
  t.plan(3);

  const process = require('../lib/process');

  t.is(typeof process.isLinux(), 'boolean');
  t.is(typeof process.getReport(), 'object');
  t.is(process.getReport(), process.getReport());
});
