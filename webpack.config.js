const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');


module.exports = {
  mode: 'development',

  devtool: 'source-map',
  entry: {
    app: './src/app.js',
  },

  devServer: {
    contentBase: './dist',
    port: 8081,
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Escape Room BOS+',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        },
      },
      {
        test: /\.(wav|mp4)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
    ],
  },

  output: {
    filename: 'assets/js/[name].js',
    path: '/code/dist',
  },
};
