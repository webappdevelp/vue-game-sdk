const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '//cdn.bu.huiyaohuyu.com/games/' : '/',
  // publicPath: process.env.NODE_ENV === 'production' ? '/games/' : '/',
  /* devServer: {
    https: false,
    host: 'sdk.zhihuigu168.com',
    port: 8080
  }, */
  integrity: false,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      // 指定游戏的ico文件
      args[0].favicon = 'public/shenzhen.ico';
      return args;
    });
    
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  }
};
