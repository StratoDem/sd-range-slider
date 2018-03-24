const path = require('path');
const webpack = require('webpack');

const sourcePath = path.join(__dirname, '../src');
const bundlesPath = path.resolve('./sd_range_slider');
const nodeModulesPath = path.join(__dirname, '../node_modules/');


module.exports = {
  context: sourcePath,
  entry: {
    // relative to sourcePath
    bundle: './index'
  },
  output: {
    library: 'sd_range_slider',
    libraryTarget: 'this',
    path: bundlesPath,
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('debug')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /node_modules/,
        use: ['ify-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      nodeModulesPath,
      sourcePath
    ]
  },
  externals: {
    // Use external version of React
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  watchOptions: {
    poll: 500,
    ignored: /node_modules/
  }
};
