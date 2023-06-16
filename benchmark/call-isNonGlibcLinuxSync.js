const performance = require('perf_hooks').performance;
const libc = require('..');

const now = performance.now();
libc.isNonGlibcLinuxSync();

console.log(`[isNonGlibcLinux] Time Spent ${performance.now() - now}ms`);
