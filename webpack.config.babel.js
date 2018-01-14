import path from 'path'

module.exports = {
  entry: {
    preload: './src/js/index.js'
  },
  output: {
    path: pat.join(__dirname, '.'),
    publicPath: 'dist',
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js'
  }
}