export function setCookie(name: string, value: string, days: number = 7) {
  const t = new Date();
  t.setTime(t.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + '=' + escape(value) + ';expires=' + t.toUTCString() + ';path=/;';
}
export function getCookie(name: string) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);

  if (arr) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}
export function delCookie(name: string) {
  setCookie(name, '', -1);
}
