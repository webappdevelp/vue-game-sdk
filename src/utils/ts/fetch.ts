// fetch polyfill
// import 'whatwg-fetch';
import userAgent from './device/userAgent';

interface CusError {
  code: any;
}

class CusError extends Error {
  constructor(props: { message: string; code: any }) {
    super();
    this.message = props.message;
    this.code = props.code;
  }
}

function getNetType() {
  const type = /nettype\/\S*/gi.exec(userAgent);
  if (type !== null) {
    return type.toString().replace('NetType/', '');
  }
  return 'unknow';
}

function setHeaders(params: { [prop: string]: string }) {
  const headers = new Headers();
  if (params) {
    Object.keys(params).forEach((h: string) => {
      headers.append(h, params[h]);
    });
  }
  return headers;
}

function checkStatus(response: Response) {
  const { status, statusText } = response;
  if (status === 200) {
    return response.json();
  }
  throw new CusError({
    code: status,
    message: statusText || '接口请求失败了'
  });
}

function setQueryString(datas: any = {}) {
  return (
    datas &&
    Object.keys(datas).reduce((prev: string, next: string) => {
      if (next) {
        return `${next}=${datas[next]}${!!prev ? `&${prev}` : ''}`;
      }
      return prev;
    }, '')
  );
}

function formatDatas(headers: { [prop: string]: string }, datas: any) {
  if (
    headers &&
    headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    return setQueryString(datas);
  } else {
    return JSON.stringify(datas);
  }
}

function checkCode(response: {
  status?: number;
  message?: string;
  data?: any;
  data_list?: any;
  Code?: number;
  UserId?: string;
  Ext?: any;
  OrderId?: string;
  Message?: string;
  charaList?: any[];
}) {
  const {
    status,
    message,
    data,
    data_list,
    Code,
    Message,
    UserId,
    Ext,
    OrderId,
    charaList
  } = response;
  if (status === 0 || Code === 0 || charaList) {
    return {
      status,
      Code,
      data,
      data_list,
      message: Message || message,
      UserId,
      Ext,
      OrderId,
      charaList
    };
  }
  throw new CusError({
    message: Message || message || '接口请求异常',
    code: status || Code
  });
}

function createAjax(method: string) {
  return (
    url: string,
    params?: {
      datas?: any;
      headers?: any;
    }
  ) => {
    let fetchParams: RequestInit = {
      method,
      credentials: 'omit'
    };
    if (params && params.headers) {
      fetchParams = {
        ...fetchParams,
        headers: setHeaders(params.headers)
      };
    }
    const datas: any = {
      platform: 'h5',
      nettype: getNetType(),
      ...((params && params.datas) || {})
    };
    if (method === 'post') {
      fetchParams = {
        ...fetchParams,
        body: formatDatas(params && params.headers, datas)
      };
    } else {
      const queryStr = setQueryString(datas);
      if (url.indexOf('?') > -1) {
        url += `&${queryStr}`;
      } else {
        url += `?${queryStr}`;
      }
    }
    return fetch(url, fetchParams)
      .then(checkStatus)
      .then(checkCode);
  };
}

export const get = createAjax('get');

export const post = createAjax('post');
