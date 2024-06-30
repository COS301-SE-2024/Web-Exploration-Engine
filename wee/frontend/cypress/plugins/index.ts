// cypress/plugins/index.js
// cypress/support/index.js

import '@cypress/code-coverage/support';
import task from '@cypress/code-coverage/task';

import codeCoverageTask from '@cypress/code-coverage/task';
console.log("testing 123")
module.exports = (on: any, config: any) => {
  codeCoverageTask(on, config);
  return config;
};

export default function (on: any, config: any) {
  task(on, config);
  return config; // <-- REQUIRED
}

/* module.exports = (on, config) => {
  on('task', require('@cypress/code-coverage/task'));
}; */