// 是否是object对象
export function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}