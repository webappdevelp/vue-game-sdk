/// <reference path="../../global.d.ts" />

// 微信支付
interface PayInfo {
  timeStamp: number;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}
export function wxJSSDKPay(params: PayInfo): Promise<{ errMsg: string }> {
  return new Promise((resolve, reject) => {
    if (window.wx && window.wx.chooseWXPay) {
      window.wx.chooseWXPay({
        ...params,
        timestamp: params.timeStamp,
        success: (res: { errMsg: string }) => {
          resolve(res);
        },
        fail: (res: any) => {
          reject(res);
        },
        cancel: (res: any) => {
          reject(res);
        }
      });
    } else {
      reject();
    }
  });
}
