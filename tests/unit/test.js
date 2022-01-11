'use strict';

const test = require('ava');
const proxyquire = require('proxyquire')
  .noCallThru()
  .noPreserveCache();

test('constants', (t) => {
  t.plan(2);

  const libc = require('../../');

  t.is(libc.GLIBC, 'glibc');
  t.is(libc.MUSL, 'musl');
});

test('linux - glibc family and version detected via report', async (t) => {
  t.plan(6);

  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        header: {
          glibcVersionRuntime: '1.23'
        }
      })
    }
  });

  t.is(await libc.family(), libc.GLIBC);
  t.is(await libc.version(), '1.23');
  t.false(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), libc.GLIBC);
  t.is(libc.versionSync(), '1.23');
  t.false(libc.isNonGlibcLinuxSync());
});

test('linux - musl family detected via report', async (t) => {
  t.plan(4);

  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        sharedObjects: ['/lib/ld-musl-x86_64.so.1']
      })
    }
  });

  t.is(await libc.family(), libc.MUSL);
  t.true(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), libc.MUSL);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - glibc family detected via child process', async (t) => {
  t.plan(4);

  const out = 'glibc 1.23\nldd (GLIBC) 1.23\nCopyright\netc';
  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(await libc.family(), libc.GLIBC);
  t.false(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), libc.GLIBC);
  t.false(libc.isNonGlibcLinuxSync());
});

test('linux - musl family detected via child process', async (t) => {
  t.plan(4);

  const out = 'getconf: GNU_LIBC_VERSION: unknown variable\nmusl libc\nVersion 1.2.3\netc';
  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({
        sharedObjects: []
      })
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(await libc.family(), libc.MUSL);
  t.true(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), libc.MUSL);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - unknown family', async (t) => {
  t.plan(4);

  const out = 'unknown';
  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(await libc.family(), null);
  t.true(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), null);
  t.true(libc.isNonGlibcLinuxSync());
});

test('linux - unknown family (exec fails)', async (t) => {
  t.plan(4);

  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(new Error()),
      execSync: () => { throw new Error(); }
    }
  });

  t.is(await libc.family(), null);
  t.true(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), null);
  t.true(libc.isNonGlibcLinuxSync());
});

test('non-linux - unknown family', async (t) => {
  t.plan(4);

  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => false
    }
  });

  t.is(await libc.family(), null);
  t.false(await libc.isNonGlibcLinux());

  t.is(libc.familySync(), null);
  t.false(libc.isNonGlibcLinuxSync());
});

// version

test('linux - glibc version detected via child process', async (t) => {
  t.plan(2);

  const out = 'glibc 1.23\nldd (GLIBC) 1.23\nCopyright\netc';
  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(await libc.version(), '1.23');
  t.is(libc.versionSync(), '1.23');
});

test('linux - musl version detected via child process', async (t) => {
  t.plan(2);

  const out = 'getconf: GNU_LIBC_VERSION: unknown variable\nmusl libc\nVersion 1.2.3\netc';
  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(await libc.version(), '1.2.3');
  t.is(libc.versionSync(), '1.2.3');
});

test('linux - unknown version', async (t) => {
  t.plan(2);

  const out = 'unknown';
  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(null, out),
      execSync: () => out
    }
  });

  t.is(await libc.version(), null);
  t.is(libc.versionSync(), null);
});

test('linux - unknown version (exec fails)', async (t) => {
  t.plan(2);

  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => true,
      getReport: () => ({})
    },
    child_process: {
      exec: (_c, cb) => cb(new Error()),
      execSync: () => { throw new Error(); }
    }
  });

  t.is(await libc.version(), null);
  t.is(libc.versionSync(), null);
});

test('non-linux - unknown version', async (t) => {
  t.plan(2);

  const libc = proxyquire('../../', {
    './process': {
      isLinux: () => false
    }
  });

  t.is(await libc.version(), null);
  t.is(libc.versionSync(), null);
});

test('process (internal)', (t) => {
  t.plan(3);

  const process = require('../../lib/process');

  t.is(typeof process.isLinux(), 'boolean');
  t.is(typeof process.getReport(), 'object');
  t.is(process.getReport(), process.getReport());
});
