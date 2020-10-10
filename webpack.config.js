const path = require('path');

module.exports = {
    mode: "production",
    entry: {
      app: './frontend/src/index.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader']
        },
      ]
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'frontend/static/frontend/'),
    },
  };