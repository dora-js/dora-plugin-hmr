import hotMiddleware from 'webpack-hot-middleware';
import webpack from 'atool-build/lib/webpack';
import { join } from 'path';

let middleware = null;

export default {

  'middleware'() {
    const compiler = this.get('compiler');
    if (!compiler) {
      throw new Error('[error] must used together with dora-plugin-webpack');
    }

    return function* (next) {
      if (!middleware) {
        middleware = hotMiddleware(compiler);
      }
      yield middleware.bind(null, this.req, this.res);
      yield next;
    };
  },

  'webpack.updateConfig.finally'(webpackConfig) {
    const { port } = this;
    const hotEntry = `webpack-hot-middleware/client?path=http://127.0.0.1:${port}/__webpack_hmr`;
    // 修改 entry, 加上 webpack-hot-middleware/client
    webpackConfig.entry = Object.keys(webpackConfig.entry).reduce((memo, key) => {
      memo[key] = [hotEntry].concat(webpackConfig.entry[key]);
      return memo;
    }, {});

    // 修改 babel-loader 参数
    if (webpackConfig.babel) {
      webpackConfig.babel.presets.push(require.resolve('babel-preset-react-hmre'));
    }

    // Hot reload plugin
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    // Fallback resolve path for npm2
    webpackConfig.resolve.fallback = webpackConfig.resolve.fallback || [];
    webpackConfig.resolve.fallback.push(join(__dirname, '../node_modules'));

    return webpackConfig;
  },

};
