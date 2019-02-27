module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? '/games/' : '/',
  devServer: {
    host: 'cq.zhihuigu168.com'
  }
};
