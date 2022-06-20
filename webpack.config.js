const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      publicPath: '.',
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
              }
            },
          ]
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', 
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ["autoprefixer"]
                  ]
                }
              }
            },
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Sandbox',
        template: './src/index.html',
        minify: false,
        // inject: false,
        scriptLoading: 'blocking'
      }),
      new HtmlInlineScriptPlugin()
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {}
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  }
}