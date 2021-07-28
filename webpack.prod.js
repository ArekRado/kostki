const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const config = {
  mode: 'production',
  devServer: {
    port: 1234,
  },
  devtool: false,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              mimetype: 'image/png',
              limit: false,
            },
          },
        ],
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   type: "asset",
      // },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      appMountId: 'app',
      filename: 'index.html',
      template: './src/index.html',
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [['optipng', { optimizationLevel: 9 }]],
      },
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    new CleanWebpackPlugin(),
    new WebpackPwaManifest({
      name: 'Kostki',
      short_name: 'Kostki',
      description: 'Super simple kostki game!',
      background_color: '#000',
      theme_color : '#000',
      display: 'fullscreen',
      // crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
        // {
        //   src: path.resolve('src/assets/large-icon.png'),
        //   size: '1024x1024',
        // },
        {
          src: path.resolve('src/assets/maskable-icon.png'),
          size: '1024x1024',
          purpose: 'maskable',
        },
      ],
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        // babylonjs: {
        //   test: /[\\/]node_modules[\\/](babylonjs)[\\/]/,
        //   name: 'babylonjs',
        //   chunks: 'all',
        // },
      },
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = config;
