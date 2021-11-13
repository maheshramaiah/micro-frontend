const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const {
  ModuleFederationConfigBuilder,
} = require('@amzn/zaphod-module-federation-build-tool');

const projectRoot = path.join(__dirname, './');
const moduleFederationConfigBuilder = new ModuleFederationConfigBuilder(
  projectRoot,
  {
    name: 'fragment',
    exposes: {
      Button: {
        import: './src/Button.js',
        name: 'Button',
      },
    },
  }
);
const moduleFederationConfig = moduleFederationConfigBuilder
  .shareConsumedSingletonDependency(['react', 'react-dom'])
  .buildConfig();

module.exports = {
  mode: 'development',
  entry: {
    index: './src/Button.js',
  },
  output: {
    publicPath: 'http://localhost:8084/',
    // libraryTarget: 'system',
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  devServer: {
    port: 8084,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
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
    //   name: 'fragment',
    //   library: {
    //     type: 'system',
    //   },
    //   filename: 'remoteEntry.js',
    //   exposes: {
    //     Button: {
    //       import: './src/Button.js',
    //       name: 'Button',
    //     },
    //   },
    //   shared: {
    //     react: {
    //       singleton: true,
    //     },
    //     'react-dom': {
    //       singleton: true,
    //     },
    //   },
    // }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
  ],
};
