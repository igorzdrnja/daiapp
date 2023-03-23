export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {tsconfig: './tsconfig.json', useESM: true}]
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    extensionsToTreatAsEsm: ['.ts'],
    globalSetup: '<rootDir>/test/global-setup.js',
    globalTeardown: '<rootDir>/test/global-teardown.js'
};