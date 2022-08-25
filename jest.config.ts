export default {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  rootDir: 'src',
  setupFilesAfterEnv: ['<rootDir>/__tests__/__env.ts'],
  globalSetup: '<rootDir>/__tests__/__setup.ts',
  testPathIgnorePatterns: [
    '\\\\node_modules\\\\',
    '<rootDir>/__tests__/__env.ts',
    '<rootDir>/__tests__/__setup.ts',
  ],
};
