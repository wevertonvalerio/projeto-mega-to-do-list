import { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

const tsJestPreset = createDefaultPreset();

/** @type {Config} */
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    ...tsJestPreset.transform,
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false
    }
  }
};

export default config;