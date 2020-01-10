import { UPDATELOAD, UPDATEMSG, UPDATEUSERINFO } from '@/store/types';
import { login } from '@/api/u9api';
import { U9SignInOptions } from '@/api/api.d';

// u9登录
export default async (state: any, params: U9SignInOptions) => {
  const result = await login({
    ...params,
    productId: params.app,
    channelId: params.channel,
    token: params.token,
    channelUserId: params.guid,
    channelUserName: params.username
  });
  if (result.Code === 0) {
    return result.UserId;
  }
  throw result.message;
};
