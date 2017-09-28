const webpackStatsOutputConfig = require('./webpackStatsOutput.config')

export default {
  entry: {
    reactable: ['./src/reactable.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [
          /bower_components/,
          /node_modules/,
          /tmp/
        ],
        use: [{loader: 'babel-loader'}]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    symlinks: false
  },
  stats: webpackStatsOutputConfig
}
