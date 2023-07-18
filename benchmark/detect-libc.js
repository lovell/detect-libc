const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const libc = require('../');

suite.add('family', async function () {
  await libc.family();
});

suite.add('familySync', function () {
  libc.familySync();
});

suite.add('version', async function () {
  await libc.version();
});

suite.add('versionSync', function () {
  libc.versionSync();
});

suite.add('isNonGlibcLinux', async function () {
  await libc.isNonGlibcLinux();
});

suite.add('isNonGlibcLinuxSync', function () {
  libc.isNonGlibcLinuxSync();
});

suite
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest operation is ' + this.filter('fastest').map('name'));
  })
  .run({
    async: true
  });
