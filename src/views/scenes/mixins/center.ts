import { Component, Mixins } from 'vue-property-decorator';
import { UPDATETOAST, UPDATELOAD } from '@/store/types';
import { get } from '@/utils/ts/fetch';
import clipboard from '@/utils/ts/clipboard';
import AccountMix from '@/mixins/account';
import isWx from '@/utils/ts/device/isWx';

@Component
export default class AccountControl extends Mixins(AccountMix) {

  // 显示用户管理
  public showAccountPannel() {
    this.$data.showBindMobile = false;
    this.$data.psw = false;
    this.$data.showAccount = true;
    this.$data.accountActionType = '';
  }
  // 管理面板操作
  public accountAction(action: string) {
    this.$data.showAccount = false;
    switch (action) {
      case 'mobile':
        this.$data.showBindMobile = true;
        break;
      case 'psw':
        this.$data.psw = true;
        break;
      case 'logOut':
        // 如果是微信且非账号登录情况下切账号时，退出后显示登录面板
        if (isWx && !this.$data.loginFrom) {
					this.$data.loginFrom = 'username';
				}
        this.logOut();
        break;
    }
  }

  // 获取礼包列表数据
  public async getGiftsList() {
    const { gameDatas } = this.$data;
    const gamerInfo = this.$store.getters['user/gamerInfo'];
    try {
      const result = await get(`//${window.location.hostname}/lqhy/listGift`, {
        datas: {
          uid: gamerInfo.userId
        }
      });
      this.$data.gameDatas = {
        ...gameDatas,
        gifts: result.data
      };
      clipboard();
    } catch (err) {
      console.log(err && err.message);
    }
  }
  // 领取礼包
  public async getGift(id: string | number) {
    if (!id) {
      return this.$store.commit({
        type: UPDATETOAST,
        data: '参数错误'
      });
    }
    this.$store.commit({
      type: UPDATELOAD,
      data: true
    });
    const gamerInfo = this.$store.getters['user/gamerInfo'];

    try {
      const result = await get(`//${window.location.hostname}/lqhy/getGift`, {
        datas: {
          uid: gamerInfo.userId,
          id
        }
      });
      this.$store.commit({
        type: UPDATELOAD,
        data: false
      });
      const { card } = result.data;
      const { gameDatas } = this.$data;
      const { gifts } = gameDatas;
      this.$data.card = card;
      this.$data.showCard = true;
      this.$data.gameDatas = {
        ...gameDatas,
        gifts: gifts.map((item: { id: string; status: number }) => {
          if (item.id === id) {
            item.status = 1;
          }
          return item;
        })
      };
    } catch (err) {
      this.$store.commit({
        type: UPDATELOAD,
        data: false
      });
      this.$store.commit({
        type: UPDATETOAST,
        data: err && err.message
      });
    }
  }
  // 隐藏领取弹窗
  public toggleCard() {
    this.$data.showCard = !this.$data.showCard;
  }
}
