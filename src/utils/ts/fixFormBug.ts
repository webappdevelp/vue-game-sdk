import userAgent from './device/userAgent';
import isWx from './device/isWx';
import isIOS from './device/isIOS';

export default function fixFormBug() {
  if (isIOS && isWx && /OS 12/i.test(userAgent)) {
    document.addEventListener(
      'blur',
      () => {
        if (document.scrollingElement) {
          document.scrollingElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      },
      true
    );
  }
}
