import { Component, Mixins } from 'vue-property-decorator';
import { UPDATELOAD, UPDATEMSG } from '@/store/types';
import storageUserGamerInfoMix from './getStorageUserGamerInfo';
import getVerifyCodeMix from './getVerifyCode';
import isIOS from '@/utils/ts/device/isIOS';
import isAndroid from '@/utils/ts/device/isAndroid';

@Component
export default class Common extends Mixins(storageUserGamerInfoMix, getVerifyCodeMix) {
  // 加载提示
  public updateLoading(show: boolean) {
    this.$store.commit(`global/${UPDATELOAD}`, { show });
  }

  // toast 提示
  public updateToast(msg: string, time: number = 2000) {
    this.$store.commit(`global/${UPDATEMSG}`, { show: true, content: msg });
  }

  // 定义sdk参数
  public initSdkOptions(params: { aid: string; gid: string; channel: string; startOrigin: string }) {
    const { aid, gid, channel, startOrigin } = params;
    const { sdkOptions } = this.$data;
    this.$data.sdkOptions = {
      ...sdkOptions,
      ...params,
      start_origin: startOrigin,
      sdk_version: '2',
      app_id: gid,
      app: gid,
      channel_id: channel,
      channel: channel,
      aid
    };
  }

  // 微端打开浏览器方法
  public openBrowser(url: string) {
    if (isIOS) {
      window.location.href = `api://hy_action_openUrl?url=${encodeURIComponent(url)}`
    } else if (isAndroid && window.android) {
      window.android.jsToBrowser(encodeURIComponent(url));
    }
  }
}
