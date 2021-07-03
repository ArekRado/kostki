module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  verbose: false,
  globals: {
    'ts-jest': {
      babelConfig: true,
    }
  },
}