import { Component, Mixins } from 'vue-property-decorator';
import CommonMix from '@/mixins/common';
import DeviceInitMix from '@/mixins/deviceInit';
import AccountMix from '@/mixins/account';
import CenterMix from './center';
import FlagControlMix from './flagControl';
import { get } from '@/utils/ts/fetch';

@Component
export default class PageCommon extends Mixins(
  CommonMix,
  DeviceInitMix,
  AccountMix,
  CenterMix,
  FlagControlMix
) {
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
  // 更新CP传回的游戏账号信息
  public updateGamerInfo(datas: {
    zoneId: number;
    roleId: number;
    roleLevel: number;
    vip: number;
  }) {
    const { sdkOptions } = this.$data;
    let { zoneId, roleId, roleLevel, vip } = datas;
    zoneId = zoneId || 0;
    roleId = roleId || 0;
    roleLevel = roleLevel || 0;
    vip = vip || 0;

    this.$data.sdkOptions = {
      ...sdkOptions,
      zoneid: zoneId,
      roleid: roleId,
      rolelevel: roleLevel,
      vip
    };
  }
  // 登录面板交互
  public switchLogin(action: string) {
    switch (action) {
      case 'mobile':
        this.$data.showLogin = false;
        this.$data.showMobile = true;
        break;
      case 'fast':
        this.login({ action: 'fast' });
        break;
    }
  }
  // 获取短信验证码
  public getCode(
    {
      mobile,
      action,
      success,
      fail
    }: {
      mobile: string;
      action: string;
      success?: () => void;
      fail?: () => void;
    } = { mobile: '', action: '' }
  ) {
    this.getVerifyCode({
      cutdown: true,
      mobile,
      action,
      success,
      fail
    });
  }
}
