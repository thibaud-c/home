module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  outputDir: 'docs'  // GitHub Pages can serve from /docs folder
}