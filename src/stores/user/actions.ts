import {
  UPDATELOAD,
  UPDATETOAST,
  UPDATEUSERINFO,
  UPDATEGAMERINFO,
  UPDATEUSERAPPINFO,
  DELUSERINFO,
  UPDATEUSERACTION
} from '@/stores/types';
import {
  checkUser,
  login,
  mobileLogin,
  fastReg,
  logOut as dropOut,
  getServiceInfo,
  bindMobile,
  resetPassword,
  updatePassword
} from '@/api/api';
import { login as gameLogin, report } from '@/api/u9api';
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
        fastReg({
          ...params
        })
          .then((res: { data: any }) => {
            let { data } = res;
            data = data || {};
            commit({
              type: UPDATEUSERINFO,
              data: {
                data: {
                  ...data
                },
                action: 'logined'
              }
            });
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
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
                data: {
                  ...data
                },
                action: 'logined'
              }
            });
            commit(
              {
                type: UPDATELOAD,
                data: false
              },
              { root: true }
            );
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
        checkUser(params.username)
          .then(() => {
            login({
              ...params
            })
              .then((res: { data: any }) => {
                let { data } = res;
                data = data || {};
                commit({
                  type: UPDATEUSERINFO,
                  data: {
                    data: {
                      ...data
                    },
                    action: 'logined'
                  }
                });
                commit(
                  {
                    type: UPDATELOAD,
                    data: false
                  },
                  { root: true }
                );
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
          })
          .catch((err) => {
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
                data: '账号不存在'
              },
              { root: true }
            );
          });
        break;
    }
  },
  // 登录游戏
  loginGame: (
    { state, commit }: { state: any; commit: any },
    params: {
      app: string;
      app_id: string;
      device: number;
    }
  ) => {
    // 显示 loading
    commit(
      {
        type: UPDATELOAD,
        data: true
      },
      { root: true }
    );
    const { userInfo } = state;
    gameLogin({
      device: params.device,
      uid: userInfo.uid,
      ProductId: params.app,
      Token: userInfo.token,
      ChannelUserId: userInfo.guid,
      ChannelUserName: userInfo.username
    })
      .then((res: { UserId: string | undefined }) => {
        const { UserId } = res;
        if (UserId) {
          commit({
            type: UPDATEGAMERINFO,
            data: {
              data: {
                userId: UserId,
                appId: params.app_id
              },
              action: 'logined'
            }
          });
        }
        // 显示 loading
        commit(
          {
            type: UPDATELOAD,
            data: false
          },
          { root: true }
        );
      })
      .catch((err: { message: string }) => {
        // 显示 loading
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
  },
  // 日志上报
  logReport: (
    { commit }: { commit: any },
    params: {
      device: number;
      role_id?: number;
      role_level?: number;
      role_name?: string;
      zone_id?: number;
      zone_name?: string;
      balance?: number;
      party_name?: string;
      vip?: number;
    }
  ) => {
    return new Promise((resolve, reject) => {
      report(params)
        .then(() => {
          resolve();
        })
        .catch((err: { message: string }) => {
          commit(
            {
              type: UPDATETOAST,
              data: err.message
            },
            { root: true }
          );
          reject();
        });
    });
  },
  // 退出登录
  logOut: ({ commit }: { commit: any }) => {
    commit(
      {
        type: UPDATELOAD,
        data: true
      },
      { root: true }
    );
    dropOut()
      .then(() => {
        commit({
          type: DELUSERINFO
        });
        commit({
          type: UPDATEUSERACTION,
          data: 'logOut'
        });
        commit(
          {
            type: UPDATETOAST,
            data: '退出成功'
          },
          { root: true }
        );
        commit(
          {
            type: UPDATELOAD,
            data: false
          },
          { root: true }
        );
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
  },
  // 获取控制中心相关数据
  getControlInfo: (
    { state, commit }: { state: any; commit: any },
    params: { app: string; app_id: string; device: number }
  ) => {
    const { userInfo } = state;
    const { app, app_id, device } = params;
    return new Promise(resolve => {
      getServiceInfo({
        token: userInfo.token,
        guid: userInfo.guid,
        app,
        app_id,
        device
      })
        .then((res: { data: { app: any; user: any } }) => {
          const { app, user } = res.data;
          commit({
            type: UPDATEUSERINFO,
            data: {
              data: {
                ...user
              },
              action: userInfo.mobile !== user.mobile ? 'logined' : 'updated'
            }
          });
          commit({
            type: UPDATEUSERAPPINFO,
            data: app
          });
          resolve();
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
    });
  },
  // 绑定手机号
  mobileBind: (
    { state, commit, dispatch }: { state: any; commit: any; dispatch: any },
    params: { mobile: string; code: string }
  ) => {
    commit(
      {
        type: UPDATELOAD,
        data: true
      },
      { root: true }
    );
    const { userInfo } = state;
    return new Promise(resolve => {
      bindMobile({
        token: userInfo.token,
        guid: userInfo.guid,
        ...params
      })
        .then(() => {
          commit(
            {
              type: UPDATELOAD,
              data: false
            },
            { root: true }
          );
          dispatch('getControlInfo', { ...params }).then(() => resolve());
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
    });
  },
  // 更新密码
  passwordUpdate: (
    { state, commit }: { state: any; commit: any },
    params: { old_password: string; password: string; re_password: string }
  ) => {
    commit(
      {
        type: UPDATELOAD,
        data: true
      },
      { root: true }
    );
    const { userInfo } = state;
    const { old_password, password, re_password } = params;
    return new Promise(resolve => {
      updatePassword({
        token: userInfo.token,
        guid: userInfo.guid,
        old_password,
        password,
        re_password
      })
        .then((res: { data: any }) => {
          commit(
            {
              type: UPDATELOAD,
              data: false
            },
            { root: true }
          );
          const { data } = res;
          commit({
            type: UPDATEUSERINFO,
            data: {
              data: {
                ...data
              },
              action: 'logined'
            }
          });
          commit(
            {
              type: UPDATETOAST,
              data: '密码修改成功'
            },
            { root: true }
          );
          resolve();
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
    });
  },
  // 重置密码
  passwordReset: (
    { state, commit }: { state: any; commit: any },
    params: {
      mobile: string;
      code: string;
      password: string;
    }
  ) => {
    commit(
      {
        type: UPDATELOAD,
        data: true
      },
      { root: true }
    );
    const { userInfo } = state;
    const { mobile, code, password } = params;
    return new Promise(resolve => {
      resetPassword({
        token: userInfo.token,
        guid: userInfo.guid,
        mobile,
        code,
        password
      })
        .then((res: { data: any }) => {
          commit(
            {
              type: UPDATELOAD,
              data: false
            },
            { root: true }
          );
          const { data } = res;
          commit({
            type: UPDATEUSERINFO,
            data: {
              data: {
                ...data
              },
              action: 'logined'
            }
          });
          commit(
            {
              type: UPDATETOAST,
              data: '密码修改成功'
            },
            { root: true }
          );
          resolve();
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
    });
  }
};

export default actions;
