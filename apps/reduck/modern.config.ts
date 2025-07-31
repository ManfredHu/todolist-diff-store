import { appTools, defineConfig } from '@modern-js/app-tools';
import { statePlugin } from '@modern-js/plugin-state';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
    statePlugin(),
  ],
});
