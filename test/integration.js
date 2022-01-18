'use strict';

const { familySync, versionSync } = require('../');

const family = familySync() || 'unknown-family';
const version = versionSync() || 'unknown-version';

process.stdout.write(`${family} ${version}\n`);
