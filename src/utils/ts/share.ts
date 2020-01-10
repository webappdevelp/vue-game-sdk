import isWx from './device/isWx';
import isQQ from './device/isQQ';
import isQzone from './device/isQzone';
import isMiniProgam from './device/isMiniProgram';
import { post } from './fetch';
import switchApi from '@/api/switchApi';
import loadJS from './loadJS';

const wxApi = '//res2.wx.qq.com/open/js/jweixin-1.4.0.js';
const qqApi = '//open.mobile.qq.com/sdk/qqapi.js?_bid=152';
const qzoneApi =
  '//qzonestyle.gtimg.cn/qzone/phone/m/v4/widget/mobile/jsbridge.js?_bid=339';
const jsApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareQZone',
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'chooseImage',
  'previewImage',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'closeWindow',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
];

function getWxConfig({
  start_origin,
  channel_id,
  app_id
}: {
  start_origin: string;
  channel_id: string;
  app_id: string;
}) {
  return post(`//${window.location.hostname}/lqhy/wxConfig`, {
    datas: {
      url: encodeURIComponent(window.location.href.split('#')[0]),
      channel_id,
      app_id
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

function initWx(data: {
  channel_id: string;
  app_id: string;
  start_origin: string;
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
  type?: string;
  dataUrl?: string;
  callback?: () => void;
}) {
  Promise.all([getWxConfig(data), loadJS(wxApi)])
    .then(
      (
        res: [
          any,
          any
        ]
      ) => {
        if (window.wx) {
          window.wx.config({
            debug: false,
            ...res[0].data,
            jsApiList
          });
          if (window.wx.ready && data) {
            const { title, desc, link, imgUrl } = data;
            window.wx.ready(() => {
              window.wx.updateAppMessageShareData({
                title,
                desc,
                link,
                imgUrl,
                success: () => {
                  if (data.callback && data.callback instanceof Function) {
                    data.callback();
                  }
                }
              });
              window.wx.updateTimelineShareData({
                title,
                link,
                imgUrl,
                success: () => {
                  if (data.callback && data.callback instanceof Function) {
                    data.callback();
                  }
                }
              });
              window.wx.onMenuShareQQ({
                title,
                desc,
                link,
                imgUrl,
                success: () => {
                  if (data.callback && data.callback instanceof Function) {
                    data.callback();
                  }
                }
              });
              window.wx.onMenuShareQZone({
                title,
                desc,
                link,
                imgUrl,
                success: () => {
                  if (data.callback && data.callback instanceof Function) {
                    data.callback();
                  }
                }
              });
            });
          }
        }
      }
    )
    .catch((err: any) => {
      console.log(err);
    });
}

function initQQ(data: {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
  callback?: () => void;
}) {
  loadJS(qqApi)
    .then(() => {
      const info: any = {
        title: data.title,
        desc: data.desc,
        share_url: data.link,
        image_url: data.imgUrl
      };
      window.mqq.data.setShareInfo(info);
      if (data.callback && data.callback instanceof Function) {
        data.callback();
      }
    })
    .catch((e: any) => {
      console.log(e);
    });
}

function initQzone(data: {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
  callback?: () => void;
}) {
  loadJS(qzoneApi)
    .then(() => {
      if (window.QZAppExternal && window.QZAppExternal.setShare) {
        var imageArr = [],
          titleArr = [],
          summaryArr = [],
          shareURLArr = [];
        for (var i = 0; i < 5; i++) {
          imageArr.push(data.imgUrl);
          shareURLArr.push(data.link);
          if (i === 4) {
            titleArr.push(data.desc);
            summaryArr.push(data.title);
          } else {
            titleArr.push(data.title);
            summaryArr.push(data.desc);
          }
        }
        window.QZAppExternal.setShare(
          function() {
            if (data.callback && data.callback instanceof Function) {
              data.callback();
            }
          },
          {
            type: 'share',
            image: imageArr,
            title: titleArr,
            summary: summaryArr,
            shareURL: shareURLArr
          }
        );
      }
    })
    .catch((e: any) => {
      console.log(e);
    });
}

function setShareInfo(data: {
  start_origin: string;
  channel_id: string;
  app_id: string;
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
  type?: string;
  dataUrl?: string;
  callback?: () => void;
}) {
  if (isWx || isMiniProgam) {
    return initWx(data);
  } else if (isQQ) {
    return initQQ(data);
  } else if (isQzone) {
    return initQzone(data);
  }
}

export default setShareInfo;
