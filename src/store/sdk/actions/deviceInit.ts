import { deviceInit as api_deviceInit } from '@/api/api';
import { deviceInit as u9_deviceInit } from '@/api/u9api';
import { DeviceInitOptions } from '@/api/api.d';

export default async (state: any, params: DeviceInitOptions) => {
  const init =
    params.http_origin === 'u9' ? u9_deviceInit : api_deviceInit;
  // delete params.http_origin;
  return init({
    ...params
  });
};
