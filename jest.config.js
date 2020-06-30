module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  preset: 'ts-jest',
  testRegex: '.*/__tests__/.*\\.(test|spec)\\.ts$',
  moduleFileExtensions: ['js', 'ts'],
  setupFiles: ['dotenv/config'],
  collectCoverageFrom: ['**/*', '!index.ts', '!jest.config.js', '!dist/**/*', '!coverage/**/*', '!**/__tests__/**/*'],
  verbose: true,
};
