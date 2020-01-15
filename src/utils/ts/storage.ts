// 优先采用storage存储，否则采用Cookie模式存储
import Cookies from 'js-cookie';
// 设置缓存数据, 传入的数据类型建议：Object
function setStorage(name: string, value: any, days: number = 360) {
  try {
    // delStorage(name);
    window.localStorage.setItem(
      name,
      JSON.stringify({
        expires: new Date().getTime() + days * 24 * 3600,
        value
      })
    );
  } catch (err) {
    Cookies.set(name, JSON.stringify(value), { expires: days });
  }
}

// 获取缓存数据，数据类型：Object | null
function getStorage(name: string) {
  try {
    const nowTime = new Date().getTime();
    let datas: any = JSON.parse(window.localStorage.getItem(name) || 'null');
    if (datas) {
      const { expires, value } = datas;
      if (nowTime < expires) {
        return value;
      }
      delStorage(name);
      return null;
    }
    return JSON.parse(Cookies.get(name) || 'null');
  } catch (err) {
    console.info('get storage error ', err && err.message);
  }
}

// 清除缓存数据
function delStorage(name: string) {
  try {
    window.localStorage.removeItem(name);
    Cookies.remove(name);
  } catch (err) {
    console.info('remove storage error ', err && err.message);
  }
}

export {
  Cookies,
  getStorage,
  setStorage,
  delStorage
}