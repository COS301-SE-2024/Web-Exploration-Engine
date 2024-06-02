const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset,
  collectCoverage: true,
  coverageDirectory: 'wee/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
 };
