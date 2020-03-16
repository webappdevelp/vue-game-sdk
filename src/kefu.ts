export default (gtag?: string, gid?: string, gameName?: string) => {
  let info = {};
  switch(gtag) {
    case 'dhdt':
      info = {
        link:
          'https://1861899.s2.udesk.cn/im_client/?web_plugin_id=19259&group_id=23298',
        numbers: null,
        wxqrcode: require(`@/assets/games/${gtag}/qrcode.jpg`),
        qrcode: `
        <img src="${require(`@/assets/games/${gtag}/qrcode.jpg`)}">
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
        link:
          'https://1861899.s2.udesk.cn/im_client/?web_plugin_id=19259&group_id=23298',
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
  }
  return info;
};
