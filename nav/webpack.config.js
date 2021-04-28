const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  output: {
    publicPath: 'http://localhost:8081/',
    // libraryTarget: 'system',
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  devServer: {
    port: 8081,
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
    new ModuleFederationPlugin({
      name: 'nav',
      library: {
        type: 'system',
        // name: 'nav',
      },
      filename: 'remoteEntry.js',
      exposes: {
        Header: {
          import: './src/Header.js',
          name: 'Header',
        },
        Footer: {
          import: './src/Footer.js',
          name: 'Footer',
        },
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps['react'],
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        'single-spa-react': {
          singleton: true,
          requiredVersion: deps['single-spa-react'],
        },
        'styled-components': {
          singleton: true,
          requiredVersion: deps['styled-components'],
        },
        'useless-lib': {},
      },
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
  ],
};
