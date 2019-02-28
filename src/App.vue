<template>
  <div id="app">
    <router-view/>
    <loading :show="loading"/>
    <toast :show.sync="toast.show" :msg="toast.msg"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import { mapState } from 'vuex';
import { getStorage } from '@/utils/ts/storage';
import { getCookie } from '@/utils/ts/cookies';
import getQuery from '@/utils/ts/getQuery';
import { userStorageName } from '@/config';
import { UPDATEUSERINFO } from '@/stores/types';
@Component({
  components: {
    Loading,
    Toast
  },
  computed: {
    ...mapState(['toast', 'loading'])
  }
})
export default class App extends Vue {
  private data() {
    return {};
  }

  // methods
  private getStorageUserInfo(gid: string, openid: string) {
    const cookieUserInfo = JSON.parse(getCookie(`gm${gid}`) || 'null');
    const storeUserInfo = getStorage(`${userStorageName}${gid}`);
    let defaultUserInfo: {
      token?: string;
      uid?: number;
      guid?: string;
      username?: string;
      mobile?: string;
      openid?: string;
      appid?: string;
    } = {
      token: '',
      uid: 0,
      guid: '',
      username: '',
      mobile: '',
      openid,
      appid: gid
    };

    if (storeUserInfo) {
      defaultUserInfo = {
        ...defaultUserInfo,
        ...storeUserInfo
      };
      this.$store.commit({
        type: `user/${UPDATEUSERINFO}`,
        data: {
          data: {
            ...defaultUserInfo
          }
        }
      });
    } else if (cookieUserInfo) {
      defaultUserInfo = {
        ...defaultUserInfo,
        uid: cookieUserInfo.hyUid,
        guid: cookieUserInfo.channelUserId,
        username: cookieUserInfo.channelUserName,
        token: cookieUserInfo.token
      };
      this.$store.commit({
        type: `user/${UPDATEUSERINFO}`,
        data: {
          data: {
            ...defaultUserInfo
          },
          action: 'logined'
        }
      });
    } else {
      this.$store.commit({
        type: `user/${UPDATEUSERINFO}`,
        data: {
          data: {
            ...defaultUserInfo
          }
        }
      });
    }
  }
  // lifecycles
  private created() {
    let gid = getQuery('gid');
    let openid = getQuery('openId');
    gid = gid || '0';
    openid = openid || '0';
    this.getStorageUserInfo(gid, openid);
  }
  private errorCaptured(err: Error, vm: Comment, info: string) {
    console.log(err, vm, info);
  }
}
</script>
<style lang="scss">
@import '@/utils/sass/_reset.scss';
#app {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}
</style>
