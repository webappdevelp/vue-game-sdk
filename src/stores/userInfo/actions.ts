import {
  UPDATELOAD,
  UPDATETOAST,
  UPDATEUSERINFO,
  UPDATEUSERACTION
} from '@/stores/types';
import { login, mobileLogin, fastReg, logOut } from '@/api/api';
import { login as gameLogin } from '@/api/u9api';
const actions = {
  // 登录平台
  login: (
    { commit }: { commit: any },
    { action, params }: { action: string; params?: any }
  ) => {
    // 显示 loading
    commit(
      {
        type: UPDATELOAD,
        data: true
      },
      { root: true }
    );
    switch (action) {
      case 'fast':
        fastReg(params && params.password)
          .then((res: { data: any }) => {
            let { data } = res;
            data = data || {};
            commit({
              type: UPDATEUSERINFO,
              data: {
                ...data
              }
            });
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
            commit({
              type: UPDATEUSERACTION,
              data: action
            });
          })
          .catch((err: { message: string }) => {
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
            commit(
              {
                type: UPDATETOAST,
                data: err.message
              },
              { root: true }
            );
          });
        break;
      case 'mobile':
        mobileLogin({
          ...params
        })
          .then((res: { data: any }) => {
            let { data } = res;
            data = data || {};
            commit({
              type: UPDATEUSERINFO,
              data: {
                ...data
              }
            });
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
            commit({
              type: UPDATEUSERACTION,
              data: action
            });
          })
          .catch((err: { message: string }) => {
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
            commit(
              {
                type: UPDATETOAST,
                data: err.message
              },
              { root: true }
            );
          });
        break;
      default:
        login({
          ...params
        })
          .then((res: { data: any }) => {
            let { data } = res;
            data = data || {};
            commit({
              type: UPDATEUSERINFO,
              data: {
                ...data
              }
            });
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
            commit({
              type: UPDATEUSERACTION,
              data: action
            });
          })
          .catch((err: { message: string }) => {
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
            commit(
              {
                type: UPDATETOAST,
                data: err.message
              },
              { root: true }
            );
          });
    }
    console.log(action, params);
  },
  loginGame: (
    { state, commit }: { state: any; commit: any },
    params: {
      app: string;
      app_id: string;
      device: number;
    }
  ) => {
    const { infos } = state;
    gameLogin({
      device: params.device,
      uid: infos.uid,
      ProductId: params.app,
      Token: infos.token,
      ChannelUserId: infos.guid,
      ChannelUserName: infos.username
    })
      .then((res: { UserId: string | undefined }) => {
        const { UserId } = res;
        if (UserId) {
          commit({
            type: UPDATEUSERINFO,
            data: { userId: UserId }
          });
          commit({
            type: UPDATEUSERACTION,
            data: 'gameLogined'
          });
        }
      })
      .catch((err: { message: string }) => {
        commit(
          {
            type: UPDATETOAST,
            data: err.message
          },
          { root: true }
        );
      });
  }
};

export default actions;
