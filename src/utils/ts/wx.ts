/// <reference path="../../global.d.ts" />
import { cqApi } from '@/config';
import { post } from '@/utils/ts/fetch';
import isWx from '@/utils/ts/device/isWx';

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
// 加载微信js sdk
function importWxSDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '//res2.wx.qq.com/open/js/jweixin-1.4.0.js';
    (document.querySelector('head') as HTMLElement).append(script);
    script.onload = resolve;
    script.onerror = reject;
  });
}

// 获取微信js sdk配置信息
function getWxConfig() {
  return post(`${cqApi}/lqhy/wxConfig`, {
    datas: {
      url: encodeURIComponent(window.location.href.split('#')[0])
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

interface ShareParams {
  title: string;
  link: string;
  imgUrl: string;
  desc: string;
  type?: string;
  dataUrl?: string;
}
// 初始化微信js sdk
export function initWXJSSDK(params?: ShareParams) {
  return new Promise((resolve, reject) => {
    if (!isWx) {
      return reject;
    }
    Promise.all([getWxConfig(), importWxSDK()]).then(
      (
        res: [
          {
            data: {
              appId: string;
              nonceStr: string;
              signature: string;
              timestamp: number;
            };
          },
          any
        ]
      ) => {
        if (window.wx) {
          window.wx.config({
            debug: false,
            ...res[0].data,
            jsApiList
          });
          if (window.wx.ready && params) {
            window.wx.ready(() => {
              window.wx.onMenuShareAppMessage({
                ...params,
                success: resolve
              });
              window.wx.onMenuShareTimeline({
                ...params,
                success: resolve
              });
              window.wx.onMenuShareQQ({
                ...params,
                success: resolve
              });
              window.wx.onMenuShareQZone({
                ...params,
                success: resolve
              });
            });
          }
        }
      }
    );
  });
}

// 微信支付
interface PayInfo {
  timeStamp: number;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}
export function wxSDKPay(params: PayInfo) {
  return new Promise((resolve, reject) => {
    if (window.wx && window.wx.chooseWXPay) {
      window.wx.chooseWXPay({
        ...params,
        timestamp: params.timeStamp,
        success: (res: any) => {
          resolve(res);
        }
      });
    } else {
      reject();
    }
  });
}

function wxPayCall(payInfo: PayInfo) {
  return new Promise((resolve, reject) => {
    try {
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        payInfo,
        (res: { err_msg: string; err_desc: string; err_code: string }) => {
          if (/:ok/.test(res.err_msg)) {
            resolve({
              msg: res.err_msg
            });
          } else {
            reject({
              msg: res.err_msg
            });
          }
        }
      );
    } catch (err) {
      reject({
        msg: '当前微信支付不可用'
      });
    }
  });
}

export function wxPayRequest(payInfo: PayInfo) {
  if (typeof window.WeixinJSBridge === 'undefined') {
    return new Promise((resolve, reject) => {
      if (document.addEventListener) {
        try {
          document.addEventListener(
            'WeixinJSBridgeReady',
            () => {
              return wxPayCall(payInfo);
            },
            false
          );
        } catch (err) {
          reject({
            msg: '当前微信支付不可用'
          });
        }
      } else {
        reject({
          msg: '当前微信支付不可用'
        });
      }
    });
  } else {
    return wxPayCall(payInfo);
  }
}
