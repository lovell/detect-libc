#!/usr/bin/env node

'use strict';

if (process.platform === 'linux') {
  const { familySync, versionSync } = require('../');
  const family = familySync() || 'unknown-family';
  const version = versionSync() || 'unknown-version';
  process.stdout.write(`${family} ${version}\n`);
}
