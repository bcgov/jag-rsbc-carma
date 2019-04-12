const configureEnvironment = require('dotenv').config;

// The jest environment will override the DB user and password
// to allow the tests to cleanup and delete records as needed
configureEnvironment({
  path: '.env.jest'
});

configureEnvironment({
  path: '.env.testing',
});



