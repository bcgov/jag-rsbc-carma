'use strict';
const { spawn } = require('child_process');
var openbrowser = require('openbrowser');
const { paths } = require('../config/paths');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
// process.on('unhandledRejection', err => {
//   throw err;
// });

// Ensure environment variables are read.
const jest = require('jest');
const argv = process.argv.slice(2);

// Single thread so tests don't race each other
argv.push('--maxWorkers=1')

const integrationTestFlagIndex = argv.indexOf('--runIntegrationTests')
if (integrationTestFlagIndex > -1) {
  argv.splice(integrationTestFlagIndex, 1);
  argv.push('--testMatch');
  argv.push('<rootDir>/src/**/__integration_tests__/**/*.tests.ts?(x)');
}

// Watch unless on CI or in coverage mode
let openCoverage = false;
if (!process.env.CI) {
  if (argv.indexOf('--coverage') < 0) {
    argv.push('--watch');
  } else {
    openCoverage = true;
  }
}

let p = jest.run(argv);
if (openCoverage) {
  openbrowser(`file:///${paths.testCoveragePath}/lcov-report/index.html`)
}
