// All comments in the `stats` block below are descriptions provided in the docs at:
// https://webpack.github.io/docs/node.js-api.html#stats

module.exports = {
  assets: true, // add assets information
  assetsSort: 'name', // (string) sort the assets by that field
  cached: true, // add also information about cached (not built) modules
  children: false, // add children information
  chunkModules: false, // add built modules information to chunk information
  chunkOrigins: false, // add the origins of chunks and chunk merging info
  chunks: true, // add chunk information
  chunksSort: 'name', // (string) sort the chunks by that field
  colors: true, // With console colors
  errorDetails: true, // add details to errors (like resolving log)
  hash: false, // add the hash of the compilation
  modules: false, // add built modules information
  modulesSort: 'name', // (string) sort the modules by that field
  reasons: false, // add information about the reasons why modules are included
  source: false, // add the source code of modules
  timings: true, // add timing information
  version: false // add webpack version information
}
