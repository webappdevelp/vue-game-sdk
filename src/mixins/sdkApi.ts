import { Vue, Component } from 'vue-property-decorator';
import { Cookies, getStorage, setStorage } from '@/utils/ts/storage';
import { UPDATEGAMEINFO } from '@/store/types';
import isAndroid from '@/utils/ts/device/isAndroid';
import kefu from '@/kefu';

@Component
export default class SdkApi extends Vue {
  // 设备初始化
 public async deviceInit(origin: string = '') {
   const { query } = this.$route;
   const { sdkOptions } = this.$data;
   const { channel } = sdkOptions;
   origin = origin ? origin : [190, '190'].indexOf(channel) > -1 ? 'u9' : 'api';
   const openid = Cookies.get('openid') || '';
   const brand = !!openid ? '公众号' : !!query.mapp ? query.mapp : 'web';
   const devices = getStorage('device') || {};
   let imei = devices.imei || query.imei || query.idfa || openid || '';
   if (!imei && isAndroid && window.android) {
     imei = await window.android.getImei();
   }
   const params: any = {
      ...sdkOptions,
      brand,
      brand_desc: brand,
      imei,
      coordinate_lng: 0,
      coordinate_lat: 0,
      tel_op: 0,
      http_origin: origin
   };
   try {
     const result = await this.$store.dispatch('sdk/deviceInit', params);
     if (result) {
       this.$data.sdkOptions = {
         ...sdkOptions,
         device: result.device
       };
       if (imei !== devices.imei) {
          setStorage('device', result);
       }
       return true;
     }
   } catch (err) {
     console.log('device init error ', err && err.message);
   }
 }

 // 获取游戏数据
  public async getGame() {
    const { query } = this.$route;
    const { device_type } = query;
    const { sdkOptions } = this.$data;
    const result = await this.$store.dispatch('sdk/getGame', {
      ...sdkOptions,
      gid: sdkOptions.app
    });
    if (result) {
      result.title && (document.title = result.title);
      const url = result.cp_url.indexOf('?') > -1 ? `${result.cp_url}&origin=${window.location.hostname}${device_type ? `&device_type=${device_type}` : '' }` : `${result.cp_url}?origin=${window.location.hostname}${device_type ? `&device_type=${device_type}` : '' }`
      const params = result.json_param || {};
      this.$store.commit(`sdk/${UPDATEGAMEINFO}`, {
        id: result.gid,
        name: result.title,
        url,
        ...params,
        kefu: kefu(sdkOptions.ctype, sdkOptions.app, result.title)
      });
    }
  }
}