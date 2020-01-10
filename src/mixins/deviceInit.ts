import { Vue, Component } from 'vue-property-decorator';
import { getCookie, setCookie } from '@/utils/ts/cookies';
import isAndroid from '@/utils/ts/device/isAndroid';

@Component
export default class InitSDKOptions extends Vue {
  /**
   * 设备初始化激活数据上报
   * 渠道号154、155使用api，其他使用u9
   *  */
  public async deviceInit(origin: string = 'u9') {
    const { sdkOptions } = this.$data;
    const userInfo = this.$store.getters['user/userInfo'];
    const { openid } = userInfo;
    const deviceImei = JSON.parse(getCookie('device') || '{}');
    let storageImei = (deviceImei && deviceImei.imei) || '';
    if (!storageImei && isAndroid && window.android) {
      storageImei = await window.android.getImei();
    }
    try {
      const result = await this.$store.dispatch('user/deviceInit', {
        ...sdkOptions,
        brand: !!openid ? '公众号' : 'web',
        brand_desc: !!openid ? '公众号' : 'web',
        imei: !!openid ? openid : storageImei,
        coordinate_lng: 0,
        coordinate_lat: 0,
        tel_op: 0,
        http_origin: origin
      });
      const { status, data } = result;
      if (status === 0) {
        const { imei, device } = data;
        if (device) {
          this.$data.sdkOptions = {
            ...sdkOptions,
            device
          };
          if (storageImei !== deviceImei.imei) {
            setCookie('device', JSON.stringify({ imei }));
          }
        }
      }
    } catch (err) {
      console.log(err && err.message);
    }
    return true;
  }
}
