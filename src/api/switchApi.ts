import { shenzhen, guangfen, gaoruifa, ch1 } from '@/config';

export default (origin: string = 'gf') => {
  switch (origin) {
    case 'grf':
      return {
        api: gaoruifa.api,
        u9Api: gaoruifa.u9Api,
        cqApi: gaoruifa.cqApi,
        h5Api: gaoruifa.h5Api,
        bu: gaoruifa.bu
      };
    case 'sz':
      return {
        api: shenzhen.api,
        u9Api: shenzhen.u9Api,
        cqApi: shenzhen.cqApi
      };
    case 'ch1':
      return {
        api: ch1.api,
        u9Api: ch1.u9Api,
        cqApi: ch1.cqApi
      };
    default:
      return {
        api: guangfen.api,
        u9Api: guangfen.u9Api,
        cqApi: guangfen.cqApi
      };
  }
};
