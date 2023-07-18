const performance = require('perf_hooks').performance;
const libc = require('..');

const now = performance.now();
libc.familySync();

console.log(`[family] Time Spent ${performance.now() - now}ms`);
