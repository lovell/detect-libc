var fs = require('fs');
var libc = require('../../lib/detect-libc.js');

var result = { };
result['libc.family'] = libc.family || 'unknown';
result['libc.version'] = libc.version || 'unknown';
result['detect.method'] = libc.method || 'unknown';
result['node.version'] = process.versions.node;

var osRelease =
  (fs.existsSync('/etc/os-release')
    ? fs.readFileSync('/etc/os-release', 'utf8')
    : ''
  )
    .split('\n')
    .filter(function (item) { return item.indexOf('=') !== -1; })
    .map(function (item) { return item.split('=', 2); })
    .reduce(function (obj, item) {
      obj[item[0].trim()] = item[1].trim().replace(/^"(.+)"$/, '$1');
      return obj;
    }, { });

result['dist.name'] = osRelease.PRETTY_NAME || 'unknown';

console.log('result=' + JSON.stringify(result));
