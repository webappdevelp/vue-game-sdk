import { checkPay, pppCheck } from '@/api/gamesPay';
import { ApiCheckPayOPtions, U9CreateOrderOptions, ApiPayIndexOptions } from '@/api/api.d';
import { UPDATELOAD, UPDATEMSG, UPDATECERTIFY, UPDATEPAY } from '@/store/types';
import isMiniProgam from '@/utils/ts/device/isMiniProgram';
import isMobile from '@/utils/ts/device/isMobile';
import isWx from '@/utils/ts/device/isWx';

// 支付检查并创建订单
export default async (state: any, params: ApiCheckPayOPtions & U9CreateOrderOptions & ApiPayIndexOptions) => {
  try {
    state.commit(`global/${UPDATELOAD}`, { show: true, content: '请稍后...' }, { root: true });
    const { guid, userId } = state.rootState.sdk.user;
    const isIOSChannel = [155, '155'].indexOf(params.channel) > -1;
    const payApi = isIOSChannel ? pppCheck : checkPay;
    const checkPayResult = await payApi({
      ...params,
      guid,
      total_fee: params.amount || 0,
      api_version: 1
    });
    const { pay_limit, available_balance, url } = checkPayResult.data;
    // 支付受限
    if (pay_limit === 1) {
      state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
      state.commit(UPDATECERTIFY, {
        pay_limit,
        tips: available_balance,
        step: 'payLimit'
      });
      return 'fail';
    } else if (pay_limit === 2) {
      state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
      state.commit(UPDATECERTIFY, {
        pay_limit,
        tips: available_balance,
        step: 'payAuth'
      });
      return 'fail';
    }
    // 创建订单
    // const getOrderUrl = isIOSChannel ? 'pppCheck' : 'createU9Order';
    const OrderId = isIOSChannel ? params.productOrderId : await state.dispatch('createU9Order', {
      ...params,
      userId,
      deviceId: params.device
    });
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    // 如果是在PC版微信内则提示使用手机打开游戏并支付
    if (isWx && !isMobile) {
      throw { message: '暂不支持PC版微信支付, 您可使用手机登录游戏进行支付哦~' };
    } else if (isMiniProgam) {
      // 如果是小程序则跳转到小程序支付
      return window.wx.miniProgram.navigateTo({
        url: `/pages/jumppay/index?app_id=${params.app}&channel_id=${params.channel}&app_order_id=${OrderId}&amount=${params.amount}&subject=${params.subject}&body=${params.body}&callback_url=${params.callbackUrl}&app_ext=${params.appExt}&ext=''&guid=${guid}&aid=${params.aid}&device=${params.device}`
      });
    } else if (isWx) {
      // 如果是wx，则直接拉起微信支付
      const wxPayResult = await state.dispatch('wxPay', {
        ...params,
        device_id: params.device,
        app_order_id: OrderId,
        app_ext: params.appExt,
        callback_url: params.callbackUrl
      });
      return wxPayResult;
    } else {
      // 否则直接拉起支付面板
      state.commit(UPDATEPAY, {
        ...params,
        device_id: params.device,
        app_order_id: OrderId,
        app_ext: params.appExt,
        callback_url: params.callbackUrl
      });
    }
  } catch (err) {
    state.commit(`global/${UPDATELOAD}`, { show: false, content: '' }, { root: true });
    state.commit(`global/${UPDATEMSG}`, { show: true, content: err && err.message }, { root: true });
    return 'fail';
  }
};
