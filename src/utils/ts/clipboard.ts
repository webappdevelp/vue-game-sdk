// 拷贝到系统剪切板
export default () => {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = '//cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js';
    script.type = 'text/javascript';
    script.onload = resolve;
    (document.querySelector('head') as HTMLElement).appendChild(script);
  });
};
