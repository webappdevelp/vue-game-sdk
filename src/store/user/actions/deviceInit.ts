import { deviceInit as api_deviceInit } from '@/api/api';
import { deviceInit as u9_deviceInit } from '@/api/u9api';
import { DeviceInitOptions } from '@/api/api.d';

export default async (state: any, params: DeviceInitOptions) => {
  let status = null;
  let data = null;
  let deviceInit =
    params.http_origin === 'u9' ? u9_deviceInit : api_deviceInit;
  // delete params.http_origin;

  try {
    const result = await deviceInit({
      ...params
    });
    status = result.status;
    data = result.data;
  } catch (err) {
    status = !0;
  }
  return {
    status,
    data
  };
};
