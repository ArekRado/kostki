const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
  mode: 'development',
  devServer: {
    port: 1234,
  },
  devtool: 'eval-source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    crossOriginLoading: 'anonymous',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                '@babel/preset-typescript',
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['> 1%'],
                    },
                  },
                ],
              ],
            },
          },
        ],
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
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              url: false, // Required as image imports should be handled via JS/TS import statements
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      appMountId: 'app',
      filename: 'index.html',
      template: './src/index.html',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

module.exports = config
