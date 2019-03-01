module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? '/games/' : '/',
  devServer: {
    host: 'm.xy.com'
  }
};
