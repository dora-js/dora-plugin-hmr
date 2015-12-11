import 'babel-polyfill';
import hotMiddleware from 'webpack-hot-middleware';
import webpack from 'atool-build/lib/webpack';
import { join } from 'path';

try {
  require('babel-core-resolve-enhance')({
    dirname: __dirname
  });
} catch (e) {
  console.error('[Error] ' + e.message);
}

let middleware = null;

export default {

  'middleware': (args) => {
    if (!global.g_dora_plugin_atool_build_compiler) {
      throw new Error('[error] must used together with dora-plugin-atool-build');
    }

    return function* (next) {
      if (!middleware) {
        middleware = hotMiddleware(global.g_dora_plugin_atool_build_compiler);
      }
      yield middleware.bind(null, this.req, this.res);
      yield next;
    };
  },

  'atool-build.updateWebpackConfig': (args, webpackConfig) => {
    const { port } = args;
    // 修改 entry, 加上 webpack-hot-middleware/client
    webpackConfig.entry = Object.keys(webpackConfig.entry).reduce((memo, key) => {
      memo[key] = [
        `webpack-hot-middleware/client?path=http://127.0.0.1:${port}/__webpack_hmr`,
        webpackConfig.entry[key],
      ];
      return memo;
    }, {});

    // 修改 babel-loader 参数
    webpackConfig.module.loaders.forEach(loader => {
      if (loader.loader === 'babel') {
        loader.query.plugins.push([
          'react-transform',
          {
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              },
              {
                transform: 'react-transform-catch-errors',
                imports: ['react', 'redbox-react'],
              },
            ],
          },
        ]);
      }
      return loader;
    });

    // Hot reload plugin
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    // Fallback resolve path for npm2
    webpackConfig.resolve.fallback = webpackConfig.resolve.fallback || [];
    webpackConfig.resolve.fallback.push(join(__dirname, '../node_modules'));

    return webpackConfig;
  }

};
