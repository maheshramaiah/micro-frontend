const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  devtool: 'source-map',
  output: {
    publicPath: 'http://localhost:8080/',
    // libraryTarget: 'system',
    // filename: '[name].[contenthash:8].js',
    // chunkFilename: '[name].[contenthash:8].chunk.js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
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
    // new ModuleFederationPlugin({
    //   name: 'shell',
    //   library: {
    //     type: 'system',
    //     // name: 'shell'
    //   },
    //   filename: 'remoteEntry.js',
    //   exposes: {
    //     Shell: {
    //       import: './src/index.js',
    //       name: 'Shell',
    //     },
    //   },
    //   // remotes: {
    //   //   nav: 'nav',
    //   //   home: 'home',
    //   //   contact: 'contact'
    //   // }
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
    //   },
    // }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      inject: true,
    }),
  ],
};
