import { Vue, Component } from 'vue-property-decorator';
import Cookies from 'js-cookie';
import { userStorageName, gamerStorageName } from '@/config';
import { UPDATEUSERINFO, UPDATEGAMERINFO, UPDATECERTIFY } from '@/store/types';

@Component
export default class Common extends Vue {
  // 设置平台玩家账号登录信息
  public getStorageUserInfo(params: { gid: string; startOrigin: string }) {
    const { gid, startOrigin } = params;
    const openid = Cookies.get('openid') || '';
    const userInfo = JSON.parse(
      Cookies.get(`${userStorageName}${gid}-${startOrigin}`) || 'null'
    );
    let defaultUser: {
      token?: string;
      uid?: number;
      guid?: string;
      username?: string;
      password?: string;
      mobile?: string;
      openid?: string;
      appid?: string;
      startOrigin?: string;
      open_real_name_auth?: number;
      online_time_limit?: number;
      age?: number
    } = {
      token: '',
      uid: 0,
      guid: '',
      username: '',
      password: '',
      mobile: '',
      appid: gid,
      openid,
      startOrigin
    };

    if (userInfo) {
      defaultUser = {
        ...defaultUser,
        ...userInfo,
        openid: !!openid ? openid : userInfo.openid || ''
      };
      // 更新用户认证信息
      this.$store.commit({
        type: `user/${UPDATECERTIFY}`,
        data: {
          age: userInfo.age
        }
      });
    }
    // 更新用户登录信息
    this.$store.commit({
      type: `user/${UPDATEUSERINFO}`,
      data: {
        ...defaultUser
      },
      action: userInfo && userInfo.token ? 'logined' : ''
    });
  }

  // 设置平台游戏玩家登录信息
  public getStorageGamerInfo(params: {
    gid: string;
    channelId: string;
    startOrigin: string;
  }) {
    const { gid, channelId, startOrigin } = params;
    const userInfo = this.$store.getters['user/userInfo'];
    const gamerInfo = JSON.parse(
      Cookies.get(`${gamerStorageName}-${userInfo.uid}-${gid}-${startOrigin}`) || 'null'
    );
    let defaultGamer: {
      appId?: string;
      channelId?: string;
      userId?: string;
      zoneId?: number;
      zoneName?: string;
      roleId?: number;
      roleName?: string;
      roleLevel?: number;
      vip?: number;
      partyName?: string;
      startOrigin?: string;
    } = {
      appId: gid,
      channelId,
      userId: '',
      startOrigin
    };

    if (gamerInfo) {
      defaultGamer = {
        ...defaultGamer,
        ...gamerInfo,
        channelId
      };
    }
    this.$store.commit({
      type: `user/${UPDATEGAMERINFO}`,
      data: {
        ...defaultGamer
      },
      action: gamerInfo ? 'logined' : ''
    });
  }
}
