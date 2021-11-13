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
    name: 'contact',
    exposes: {
      Contact: {
        import: './src/Root.js',
        name: 'Contact',
      },
    },
  }
);
const moduleFederationConfig = moduleFederationConfigBuilder
  .shareConsumedSingletonDependency(['single-spa-react'])
  .shareDependency([
    {
      packageName: 'react',
      import: 'react',
      shareKey: 'react',
      shareScope: 'newReact',
    },
    {
      packageName: 'react-dom',
      import: 'react-dom',
      shareKey: 'react-dom',
      shareScope: 'newReact',
    },
  ])
  .buildConfig();

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  output: {
    publicPath: 'http://localhost:8083/',
    // libraryTarget: 'system',
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  devServer: {
    port: 8083,
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
    //   name: 'contact',
    //   library: {
    //     type: 'system',
    //     // name: 'contact',
    //   },
    //   filename: 'remoteEntry.js',
    //   exposes: {
    //     Contact: {
    //       import: './src/Root.js',
    //       name: 'Contact',
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
    //   },
    // }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
  ],
};
