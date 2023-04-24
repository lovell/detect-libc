// Copyright 2017 Lovell Fuller and others.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const { familySync, versionSync } = require('../');

const family = familySync() || 'unknown-family';
const version = versionSync() || 'unknown-version';

process.stdout.write(`${family} ${version}\n`);
