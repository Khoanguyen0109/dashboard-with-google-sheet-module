import { theme } from './src/config/theme/themeVariables';

const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          child_process: false,
          process: false,
          fs: false,
          util: false,
          http: false,
          https: false,
          tls: false,
          net: false,
          crypto: false,
          path: false,
          os: false,
          stream: false,
          zlib: false,
        },
      },
      ignoreWarnings: [/Failed to parse source map/],
    },
    test: /\.m?jsx?$/,
    // exclude: /node_modules\/@firebase/,
    exclude: /node_modules\/@firebase\/auth/,
    ignoreWarnings: [/Failed to parse source map/],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              ...theme,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
