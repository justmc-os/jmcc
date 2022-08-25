export default {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  rootDir: 'src',
  setupFilesAfterEnv: ['<rootDir>/__tests__/__env.ts'],
  testPathIgnorePatterns: [
    '\\\\node_modules\\\\',
    '<rootDir>/__tests__/__env.ts',
  ],
};
