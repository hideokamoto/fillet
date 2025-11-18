import { Hook } from '@oclif/core';

/**
 * Init hook that runs before any command.
 * Registers esbuild to transpile TypeScript files on the fly.
 */
const hook: Hook<'init'> = async function () {
  // Use dynamic import to avoid TypeScript compilation errors
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { register } = require('esbuild-register');
  register({
    target: 'node18',
  });
};

export default hook;
