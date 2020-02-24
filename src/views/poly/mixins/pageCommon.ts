import { Component, Mixins } from 'vue-property-decorator';
import CommonMix from '@/mixins/common';
import { get, post } from '@/utils/ts/fetch';
import { getCookie, setCookie } from '@/utils/ts/cookies';
import switchApi from '@/api/switchApi';
let onlineTimeReportInterval: any = null;

@Component
export default class PageCommon extends Mixins(CommonMix) {
  // 获取链接上 device_type 参数
  public getDeviceType() {
    const { query } = this.$route;
    let { device_type } = query;
    device_type = device_type || '';
    this.$data.device_type = device_type;
  }
  // 加载页面数据
  public async getPageDatas() {
    this.updateLoading(true);
    const { sdkOptions } = this.$data;
    let datas: any = null;
    try {
      const result = await get(`//aliyun.gaoruifa.cn/game/detail`, {
        datas: {
          aid: sdkOptions.aid,
          gid: sdkOptions.app_id,
          channel: sdkOptions.channel_id
        }
      });
      this.updateLoading(false);
      datas = result.data || {};
    } catch (err) {
      this.updateLoading(false);
      this.updateToast(err && err.message);
    }
    return datas;
  }
  // 设备初始化
  public async deviceInit(url = '') {
    const { sdkOptions } = this.$data;
    const deviceImei = JSON.parse(getCookie('device') || '{}');
    const storageImei = (deviceImei && deviceImei.imei) || '';
    const storageDevice = (deviceImei && deviceImei.device) || '';
    try {
      const { h5Api } = switchApi(sdkOptions.start_origin);
      const link = url ? url : `${h5Api}/h5/init`;
      const result = await get(link, {
        datas: {
          ...sdkOptions,
          imei: !!storageImei ? storageImei : (sdkOptions.imei || ''),
          device_id: !!storageDevice ? storageDevice : (sdkOptions.deviceId || '')
        }
      });
      const { status, data } = result;
      if (status === 0) {
        delete sdkOptions.imei;
        this.$data.sdkOptions = {
          ...sdkOptions,
          deviceId: data.device_id || ''
        };
        if (!storageImei) {
          setCookie(
            'device',
            JSON.stringify({
              imei: data.imei || '',
              device: data.device_id || ''
            })
          );
        }
      } else {
        console.log('设备初始化失败');
      }
    } catch (err) {
      // this.updateToast((err && err.message) || '设备初始化失败');
      console.log(err && err.message);
    }
    return true;
  }
  // 登录
  public async loginRequest(ext: any = {}) {
    this.updateLoading(true);
    const { sdkOptions, userInfo } = this.$data;
    let users = { ...userInfo };
    try {
      const { h5Api } = switchApi(sdkOptions.start_origin);
      const result = await post(`${h5Api}/login/loginRequest`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        datas: {
          ...sdkOptions,
          channelUserId: userInfo.channelUserId,
          channelUserName: userInfo.channelUserName,
          token: userInfo.token,
          ext: JSON.stringify(ext)
        }
      });
      const { status, data } = result;
      if (status === 0) {
        this.$data.userInfo = {
          ...userInfo,
          hyUid: data.channel_uid,
          channelUserId: data.channel_uid,
          channelUserName: data.channel_username || data.channel_uid,
          userId: data.h5uid,
          token: data.token
        };
        users = this.$data.userInfo;
      }
      this.updateLoading(false);
    } catch (err) {
      this.updateLoading(false);
      this.updateToast(err && err.message);
    }
    return users;
  }
  // 支付
  public async payRequest(params: {
    amount: number;
    productOrderId: string;
    productName: string;
    productDesc: string;
    appExt: string;
    callbackUrl: string;
    serverId: number;
    serverName?: string;
    roleId: number;
    roleName?: string;
    level: number;
    vip?: number;
    goodsId: number;
    ext?: string;
  }) {
    this.updateLoading(true);
    const {
      amount,
      productOrderId,
      productName,
      productDesc,
      appExt,
      callbackUrl,
      serverId,
      serverName,
      roleId,
      roleName,
      level,
      vip,
      goodsId,
      ext
    } = params;
    const { sdkOptions, userInfo } = this.$data;
    let result: any = {};
    try {
      const { h5Api } = switchApi(sdkOptions.start_origin);
      result = await post(`${h5Api}/payRequest/payRequest`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        datas: {
          ...sdkOptions,
          token: userInfo.token,
          userId: userInfo.userId,
          productOrderId: productOrderId || 0,
          amount: amount || 0,
          callbackUrl: callbackUrl || '',
          ext: ext || '',
          appExt: appExt || '',
          productName: productName || '',
          productDesc: productDesc || '',
          serverId: serverId || 1,
          serverName,
          roleId: roleId || 1,
          roleName,
          level: level || 1,
          vip,
          goodsId: goodsId || 1
        }
      });
      this.updateLoading(false);
    } catch (err) {
      this.updateLoading(false);
      this.updateToast(err && err.message);
    }
    return result;
  }
  // 通用订单查询接口
  public async checkOrder(params: { cpOrderId: string; timestamp: number }) {
    const { sdkOptions } = this.$data;
    const { app, channel } = sdkOptions;
    const { h5Api } = switchApi(sdkOptions.start_origin);
    let result: any = null;
    try {
      result = await get(`${h5Api}/checkOrder/index/${app}/${channel}`, {
        datas: {
          ...params,
          orderId: params.cpOrderId || ''
        }
      });
    } catch (err) {
      this.updateLoading(false);
    }
    return result;
  }
  // 角色上报
  public roleReport(params: {
    roleName: string;
    roleId: number;
    serverId: number;
    serverName: string;
    zoneId: number;
    zoneName: string;
    level: number;
    vip: number;
  }) {
    const { userInfo, sdkOptions } = this.$data;
    const { h5Api } = switchApi(sdkOptions.start_origin);
    post(`${h5Api}/upload/userrole`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      datas: {
        userId: userInfo.userId,
        ...params
      }
    }).catch(err => console.log(err));
  }
  // 重置定时上报
  public resetOnlineTimeReportInterval() {
    clearInterval(onlineTimeReportInterval);
    onlineTimeReportInterval = null;
  }
  // 实名制在线时长上报
  public async reportOnlineTime(cb: () => void) {
    const { sdkOptions, userInfo } = this.$data;
    const { app, channel, time_start } = sdkOptions;
    const { bu } = switchApi(sdkOptions.start_origin);
    try {
      if (!onlineTimeReportInterval) {
        onlineTimeReportInterval = setInterval(this.reportOnlineTime, 5 * 60 * 1000);
      }
      const result = await get(`${bu}/user/onlineTimeUpload`, {
        datas: {
          uid: userInfo.userId,
          app_id: app,
          channe_id: channel,
          age: userInfo.age,
          time_start: time_start ? time_start : '',
          time_end: time_start ? time_start + 5 * 60 : ''
        }
      });
      const { time_end, limit_type, tips } = result.data;
      this.$data.sdkOptions = {
        ...sdkOptions,
        time_start: time_end
      };
      // 1：未实名，但要弹窗实名，2、3、4未成年，时间被限制，5、未实名，需弹窗，否则退出游戏
      switch (limit_type) {
        case -1:
          this.resetOnlineTimeReportInterval();
          break;
        case 1:
          this.$data.limitTipText = tips;
          this.$data.showLimitTip = true;
          break;
        case 5:
        case 2:
        case 3:
        case 4:
          this.resetOnlineTimeReportInterval();
          this.$data.limitTipText = tips;
          this.$data.showLimitTip = true;
          if (typeof cb === 'function') {
            cb();
          }
          break;
      }
    } catch (err) {
      this.resetOnlineTimeReportInterval();
      console.log(err && err.message);
    }
  }
}
