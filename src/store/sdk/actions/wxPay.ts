import { wxPay } from '@/api/gamesPay';
import { ApiGetOrderOptions } from '@/api/api.d';
import { wxJSSDKPay } from '@/utils/ts/wx';

// 拉起微信js sdk支付
export default async (state: any, params: ApiGetOrderOptions) => {
  const { guid, token, userId, openid } = state.rootState.sdk.user;
  const result = await wxPay({
    ...params,
    guid,
    token,
    openid,
    u9uid: [155, '155'].indexOf(params.channel) > -1 ? '999' : userId,
    http_source: 'JSAPI',
    pay_channel: 'WXPAY'
  });
  if (result.status === 0) {
    const { pay_info } = result.data;
    const payResult = await wxJSSDKPay(pay_info);
    const { errMsg } = payResult;
    if (/:ok/i.test(errMsg)) {
      return 'success';
    } else {
      return 'fail';
    }
  }
  throw result.message;
};
