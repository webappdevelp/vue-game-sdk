export default function getQuery(
  name: string,
  url: string = window.location.search.substr(1)
) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = url.match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return '';
}
