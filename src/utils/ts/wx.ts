/// <reference path="../../global.d.ts" />

interface PayInfo {
  appId: string;
  timeStamp: number;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
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
