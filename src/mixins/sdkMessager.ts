import { Vue, Component } from 'vue-property-decorator';
import setShareInfo from '@/utils/ts/share';
import { UPDATEMSG } from '@/store/types';
import { isObject } from '@/utils/ts/types';
let Messager: any = null;
let postInterval: any = null;

@Component
export default class SdkMessager extends Vue {

  // 配置微信分享
  public setPageShare() {
    const { sdkOptions } = this.$data;
    const game = this.$store.getters['sdk/game'];
    setShareInfo({
      channel_id: sdkOptions.channel,
			app_id: sdkOptions.app,
			start_origin: sdkOptions.start_origin,
			title: game.name || '',
			desc: game.name || '',
			link: `${window.location.origin}/games/scenes?${
				window.location.href.split('?')[1]
			}`,
			imgUrl: `${window.location.protocol}${game.kefu.wxqrcode}`,
			callback: () => {
				this.sendMessage({
					action: 'shareComplete'
				});
			}
    })
  }

  // 初始化发报机直到与CP发报机建立连接
  public initMessager() {
    Messager = (this.$refs.messager as HTMLIFrameElement).contentWindow;
    !postInterval &&
      (postInterval = setInterval(() => {
        this.sendMessage({
          action: 'init'
        });
      }, 800));
  }

  // 向CPSDK发送消息
  public sendMessage(params: { action: string; datas?: any }) {
    // console.log(params);
    if (Messager) {
      return Messager.postMessage(JSON.stringify(params), '*');
    }
    console.info('Messager undefined');
  }

  // 接收CPSDK发送的消息
  public async getMessage(e: MessageEvent) {
    const { origin, data } = e;
    // 屏蔽自身源消息
    if (origin === window.location.origin) {
      return;
    }
    try {
      const cpDatas = isObject(data) ? data : JSON.parse(data || '{}');
      const { action, datas } = cpDatas;
      const { sdkOptions } = this.$data;
      switch (action) {
        case 'blur':
          if (document.scrollingElement) {
            document.scrollingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          break;
        case 'initSuccess':
          clearInterval(postInterval);
          postInterval = null;
          break;
        case 'login':
          const userInfo = this.$store.getters['sdk/sdkUserInfo'];
          if (!userInfo.userId) {
            this.$data.showLogin = true;
          } else {
            this.sendMessage({
              action: 'loginSuccess',
              datas: userInfo
            });
          }
          break;
        case 'pay':
          const payResult = await this.$store.dispatch('sdk/pay', {
            ...sdkOptions,
            ...datas,
            productId: sdkOptions.app,
            channelId: sdkOptions.channel,
            productOrderId: datas.productOrderId || datas.cpOrderId,
            subject: datas.productName,
            body: datas.productDesc || datas.productDetail,
            callbackUrl: datas.callbackUrl || datas.callBackUrl,
            ext: ''
          });
          break;
        case 'bindMobile':
          this.$store.dispatch('sdk/bindMobile', datas).then((res: any) => {
            console.log(res);
            this.sendMessage({
              action: 'bindMobileSuccess'
            });
            this.sendMessage({
              action: 'bindMobileFail'
            });
          });
          break;
        case 'getSMSCode':
          const result = await this.$store.dispatch('sdk/getVerifyCode', datas);
          if (result) {
            this.sendMessage({
              action: 'getSMSCodeSuccess'
            });
          } else {
            this.sendMessage({
              action: 'getSMSCodeFail'
            });
          }
          break;
        case 'roleReport':
          this.$store.dispatch('sdk/roleReport', {
            ...sdkOptions,
            roleId: datas.roleId || 0,
            roleLevel: datas.roleLevel || 0,
            roleName: datas.roleName || '',
            zoneid: datas.zoneId,
            zoneName: datas.zoneName,
            balance: datas.balance || 0,
            partyName: datas.partyName || '',
            vip: datas.vip || 0
          });
          break;
        case 'logReport':
          this.$store.dispatch('sdk/logReport', {
            ...sdkOptions,
            brand: datas.brand || '',
            brand_desc: datas.brand_desc || '',
            time: datas.time || 0,
            step: datas.step || 0,
            step_desc: datas.step_desc || ''
          });
          break;
        case 'csReport':
          this.$store.dispatch('sdk/csReport', {
            ...sdkOptions,
            ...datas
          });
          break;
      }
    } catch (err) {
      this.$store.commit(`sdk/${UPDATEMSG}`, { show: true, content: err && err.message });
    }
  }


  // 监听发报机消息
  public created() {
    window.addEventListener('message', this.getMessage);
  }
}
