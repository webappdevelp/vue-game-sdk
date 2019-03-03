interface Window {
  webkit: {
    messageHandlers?: {
      setClipboardData?: {
        postMessage?: (str: string) => void;
      };
    };
  };
  android: {
    setClipboardData?: (str: string) => void;
  };
  ClipboardJS: any;
  WeixinJSBridge: {
    on: (action: string, cb: (params?: any) => void) => void;
    invoke: (event: string, params?: any, cb?: (params: any) => void) => void;
  };
  wx: {
    config: (params: {
      debug: boolean;
      appId: string;
      timestamp: number;
      nonceStr: string;
      signature: string;
      jsApiList: string[];
    }) => void;
    ready: (cb: () => void) => void;
    onMenuShareAppMessage: (params: {
      title: string;
      desc: string;
      link: string;
      imgUrl: string;
      type?: string;
      dataUrl?: string;
      success?: () => void;
    }) => void;
    onMenuShareTimeline: (params: {
      title: string;
      link: string;
      imgUrl: string;
      success?: () => void;
    }) => void;
    onMenuShareQQ: (params: {
      title: string;
      desc: string;
      link: string;
      imgUrl: string;
      success?: () => void;
      cancel?: () => void;
    }) => void;
    onMenuShareWeibo: (params: {
      title: string;
      desc: string;
      link: string;
      imgUrl: string;
      success?: () => void;
      cancel?: () => void;
    }) => void;
    onMenuShareQZone: (params: {
      title: string;
      desc: string;
      link: string;
      imgUrl: string;
      success?: () => void;
      cancel?: () => void;
    }) => void;
    updateAppMessageShareData: (params: {
      title: string;
      desc: string;
      link: string;
      imgUrl: string;
      success?: () => void;
    }) => void;
    updateTimelineShareData: (params: {
      title: string;
      link: string;
      imgUrl: string;
      success?: () => void;
    }) => void;
    chooseWXPay: (params: {
      timestamp: number;
      nonceStr: string;
      package: string;
      signType: string;
      paySign: string;
      success?: (res: any) => void;
      cancel?: (res: any) => void;
    }) => void;
  };
}
