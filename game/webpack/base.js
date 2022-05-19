const webpack = require("webpack");
const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  resolve: {
    fallback: {
      fs: false,
    },
    alias: { stream: require.resolve("stream-browserify") },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader",
      },
      {
        test: path.join(__dirname, "."),
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/react",
            {
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-react-jsx",
                "@babel/plugin-transform-async-to-generator",
              ],
            },
          ],
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../"),
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
      "process.env": JSON.stringify(dotenv.config().parsed),
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      inject: "body",
    }),
  ],
};
