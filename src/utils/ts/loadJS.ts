export default (url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
  });
};
