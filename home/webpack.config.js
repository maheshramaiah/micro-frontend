const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const {
  ModuleFederationConfigBuilder,
} = require('@amzn/zaphod-module-federation-build-tool');
const deps = require('./package.json').dependencies;

const projectRoot = path.join(__dirname, './');
const moduleFederationConfigBuilder = new ModuleFederationConfigBuilder(
  projectRoot,
  {
    name: 'home',
    exposes: {
      Home: {
        import: './src/Root.js',
        name: 'Home',
      },
    },
  }
);
const moduleFederationConfig = moduleFederationConfigBuilder
  .shareConsumedSingletonDependency([
    'react',
    'react-dom',
    'single-spa-react',
    'styled-components',
  ])
  .shareDependency(['useless-lib'])
  .buildConfig();

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  devtool: 'source-map',
  output: {
    publicPath: 'http://localhost:8082/',
    library: {
      type: 'system'
    },
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  devServer: {
    port: 8082,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin(moduleFederationConfig),
    // new ModuleFederationPlugin({
    //   name: 'home',
    //   library: {
    //     type: 'system',
    //     // name: 'home',
    //   },
    //   filename: 'remoteEntry.js',
    //   exposes: {
    //     Home: {
    //       import: './src/Root.js',
    //       name: 'Home',
    //     },
    //   },
    //   shared: {
    //     react: {
    //       singleton: true,
    //       requiredVersion: deps['react'],
    //     },
    //     'react-dom': {
    //       singleton: true,
    //       requiredVersion: deps['react-dom'],
    //     },
    //     'single-spa-react': {
    //       singleton: true,
    //       requiredVersion: deps['single-spa-react'],
    //     },
    //     'styled-components': {
    //       singleton: true,
    //       requiredVersion: deps['styled-components'],
    //     },
    //     'useless-lib': {},
    //   },
    // }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
  ],
};
