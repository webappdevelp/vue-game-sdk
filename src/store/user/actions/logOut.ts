import {
  UPDATELOAD,
  UPDATETOAST,
  DELUSERINFO,
  UPDATEUSERACTION
} from '@/store/types';
import { logOut } from '@/api/api';
import { ApiLogOutOptions } from '@/api/api.d';

export default async (
  { commit }: { commit: any },
  params: ApiLogOutOptions
) => {
  commit(
    {
      type: UPDATELOAD,
      data: true
    },
    { root: true }
  );
  let status = null;
  let message = null;
  try {
    const result = await logOut({ ...params });
    status = result.status;
    commit(
      {
        type: `user/${DELUSERINFO}`
      },
      { root: true }
    );
    commit(
      {
        type: `user/${UPDATEUSERACTION}`,
        data: 'logOut'
      },
      { root: true }
    );
  } catch (err) {
    status = !0;
    message = err && err.message;
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
