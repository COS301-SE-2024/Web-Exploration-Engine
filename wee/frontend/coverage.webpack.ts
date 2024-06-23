import * as path from 'path';

export default {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        enforce: 'post',
        include: path.join(__dirname, 'apps', 'my-app', 'src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/,
          /(ngfactory|ngstyle)\.js/,
        ],
      },
    ],
  },
};
