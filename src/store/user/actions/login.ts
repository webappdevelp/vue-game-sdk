import { UPDATELOAD, UPDATETOAST, UPDATEUSERINFO, UPDATECERTIFY } from '@/store/types';
import { checkUser, login, mobileLogin, fastReg } from '@/api/api';
import { ApiQuickRegisterOptions, ApiMobileLoginOptions, ApiUserInfoOptions, ApiSignInOptions } from '@/api/api.d';

/**
 * status: 0 成功，1 失败
 */
export default async (
  { commit }: { commit: any },
  {
    action,
    params
  }: {
    action: string;
    params: ApiQuickRegisterOptions | ApiMobileLoginOptions | ApiUserInfoOptions | ApiSignInOptions;
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
  let status = null;
  let message = null;
  let loginResult = null;
  switch (action) {
    case 'fast':
      try {
        const result = await fastReg({
          ...params
        });
        status = result.status;
        if (result.status === 0) {
          loginResult = result.data;
        }
      } catch (err) {
        status = !0;
        message = err && err.message;
      }
      break;
    case 'mobile':
      try {
        const result = await mobileLogin({
          ...params
        });
        status = result.status;
        loginResult = result.data;
      } catch (err) {
        status = !0;
        message = err && err.message;
      }
      break;
    default:
      try {
        const result = await login({ ...params });
        status = result.status;
        loginResult = result.data;
      } catch (err) {
        status = !0;
        message = err && err.message;
      }
      break;
  }
  if (loginResult) {
    commit(
      {
        type: `user/${UPDATEUSERINFO}`,
        data: {
          ...loginResult
        },
        action: 'logined'
      },
      { root: true }
    );
    // 实名认证信息
    commit(
      {
        type: `user/${UPDATECERTIFY}`,
        data: {
          age: loginResult.age,
          open_real_name_auth: loginResult.open_real_name_auth || 0,
          online_time_limit: loginResult.online_time_limit || 0
        }
      },
      { root: true }
    );
  }
  if (status !== null) {
    commit(
      {
        type: UPDATELOAD,
        data: false
      },
      { root: true }
    );
  }
  if (message) {
    commit(
      {
        type: UPDATETOAST,
        data: message
      },
      { root: true }
    );
  }
};
