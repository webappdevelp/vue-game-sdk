export default (ctype?: string, gid?: string, gameName?: string) => {
  return {
    link: 'http://q.url.cn/CD2Ozl?_type=wpa&qidian=true',
    numbers: `QQ客服：800180621
          <br>客服电话：
          <a href="tel:020-86805149">020-86805149</a>`,
    wxqrcode: require(`@/assets/games/wxqrcode.jpg`),
    qrcode: `
    <img src="${require(`@/assets/games/wxqrcode.jpg`)}">
    <p>
      <strong>关注公众号</strong>
      <br>
      <strong>账号不丢失</strong>
      <br>
      <strong>游戏随时玩</strong>
      <br>长按或扫描二维码
      <br>
      关注“${!!gid && gid !== '10092' ? '龙骑互娱' : gameName}”公众号
    </p>
    `
  };
};
