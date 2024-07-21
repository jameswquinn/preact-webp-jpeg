const path = require('path');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminWebp = require('imagemin-webp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpe?g|png)$/i,
        oneOf: [
          {
            resourceQuery: /webp/,
            use: [
              {
                loader: 'responsive-loader',
                options: {
                  adapter: require('responsive-loader/sharp'),
                  format: 'webp',
                  sizes: [300, 600, 1200],
                  name: 'images/[name]-[width].[ext]',
                },
              },
            ],
          },
          {
            use: [
              {
                loader: 'responsive-loader',
                options: {
                  adapter: require('responsive-loader/sharp'),
                  sizes: [300, 600, 1200],
                  name: 'images/[name]-[width].[ext]',
                },
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                    quality: 75,
                  },
                  optipng: false,
                  pngquant: false,
                  gifsicle: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png)$/i,
      plugins: [
        imageminWebp({
          quality: 75,
        }),
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    usedExports: true,
  },
};
