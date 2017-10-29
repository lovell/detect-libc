var fs = require('fs');
var libc = require('../../lib/detect-libc.js');

console.log('Family: ' + (libc.family || 'unknown'));
console.log('Version: ' + (libc.version || 'unknown'));
console.log('Method: ' + (libc.method || 'unknown'));
console.log('NodeJS: ' + process.versions.node);

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

console.log('Distribution: ' + (osRelease.PRETTY_NAME || 'unknown'));
