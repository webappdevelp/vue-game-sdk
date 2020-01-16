import isIOS from '@/utils/ts/device/isIOS';
import isAndroid from '@/utils/ts/device/isAndroid';

function openBrowser(mapp: boolean = false, ctype: string = '', url: string) {
  if (isIOS && mapp && /hy$/ig.test(ctype)) {
    window.location.href = `api://hy_action_openUrl?url=${encodeURIComponent(url)}`;
  } else if (mapp && /hy$/ig.test(ctype) && isAndroid && window.android) {
    window.android.jsToBrowser(encodeURIComponent(url));
  } else {
    window.location.href = url;
  }
}

export default openBrowser;
