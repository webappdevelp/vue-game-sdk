export function setStorage(name: string, value: any, days?: number) {
  delStorage(name);
  try {
    if (days) {
      return window.localStorage.setItem(
        name,
        JSON.stringify({
          expires: new Date().getTime() + days * 24 * 3600,
          value
        })
      );
    }
    return window.localStorage.setItem(
      name,
      JSON.stringify({
        value
      })
    );
  } catch (err) {
    alert(err.message);
  }
}

export function getStorage(name: string) {
  try {
    const now = new Date().getTime();
    let datas: any = window.localStorage.getItem(name);
    datas = JSON.parse(datas);
    if (datas) {
      const { expires, value } = datas;
      if (datas && expires) {
        if (now < expires) {
          return value;
        } else {
          delStorage(name);
          return null;
        }
      } else {
        return value;
      }
    }
    return null;
  } catch (err) {
    console.log(err.message);
  }
}

export function delStorage(name: string) {
  try {
    window.localStorage.removeItem(name);
  } catch (err) {
    alert(err.message);
  }
}
