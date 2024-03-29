export default (ctype?: string, gid?: string, gameName?: string) => {
  let info = {};
  if (ctype && /hy/ig.test(ctype)) {
    switch (gid) {
      case '10277':
      case '10282':
        info = {
          link: 'https://1861899.s2.udesk.cn/im_client/?web_plugin_id=19259&group_id=23298',
          numbers: null,
          wxname: '大话大唐',
          wxqrcode: require(`@/assets/games/10277/wxqrcode.jpg`),
          qrcode: `
          <img src="${require(`@/assets/games/10277/wxqrcode.jpg`)}">
          <p>
            <strong>扫描二维码</strong>
            <br>
            <strong>联系在线客服</strong>
            <br>
            <strong>领取新手礼包</strong>
          </p>
          `
        };
        break;
      default:
        info = {
          link: 'https://1861899.s2.udesk.cn/im_client/?web_plugin_id=19259&group_id=23298',
          numbers: null,
          wxqrcode: require(`@/assets/games/hy/wxqrcode.jpg`),
          qrcode: `
          <img src="${require(`@/assets/games/hy/wxqrcode.jpg`)}">
          <p>
            <strong>扫描二维码</strong>
            <br>
            <strong>联系在线客服</strong>
            <br>
            <strong>领取新手礼包</strong>
          </p>
          `
        };
        break;
  }
  } else {
    info = {
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
  }
  return info;
};
