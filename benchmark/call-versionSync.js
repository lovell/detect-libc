const performance = require('perf_hooks').performance;
const libc = require('..');

const now = performance.now();
libc.versionSync();

console.log(`[versionSync] Time Spent ${performance.now() - now}ms`);
