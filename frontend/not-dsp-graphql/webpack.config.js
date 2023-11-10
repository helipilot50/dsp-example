
// my-awesome-package/webpack.config.js

const path = require('path');

const PACKAGE_NAME = 'not-dsp-graphql';

const config = {
  context: __dirname,
  // entry: {
  //   app: './src/index.js',
  // },
  output: {
    filename: 'not-dsp-graphql.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: PACKAGE_NAME,
    umdNamedDefine: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  }
};

module.exports = (env, argv) => {
  return config;
};
