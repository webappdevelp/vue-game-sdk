interface Window {
  HyAnalySDK: any;
  webkit: {
    messageHandlers: {
      setClipboardData: {
        postMessage: (str: string) => void;
      };
      XWSDK: {
        postMessage: (params: any) => void;
      };
      winOpen: {
        postMessage: (params: any) => void;
      }
    };
  };
  Spinner: any;
  android: {
    setClipboardData: (str: string) => void;
    jsToBrowser: (str: string) => void;
    getImei: any;
    update: any;
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
    hideMenuItems: (params: { menuList: string[] }) => void;
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
      fail?: (res: any) => void;
      cancel?: (res: any) => void;
    }) => void;
    miniProgram: {
      navigateTo: (params: any) => void;
      navigateBack: (params: any) => void;
      switchTab: (params: any) => void;
      reLaunch: (params: any) => void;
      redirectTo: (params: any) => void;
      getEnv: (params: any) => void;
    }
  };
  mqq: {
    ui: {
      setOnShareHandler: (params: any) => void;
      shareMessage: (params: any, callback: (params: any) => void) => void;
    },
    data: {
      setShareInfo: (params: any) => void;
    }
  },
  QZAppExternal: {
    setShare: (fn: (params: any) => void, params: any) => void;
  },
  HORTOR_AGENT: any;
  TZAppBridge: (params: any) => void;
  TZAppBridgeCallback: (params: any) => void;
  egret_log: any;
  __wxjs_environment: string;
  sdw: any;
  QuickSDK: any;
  QTTGame: any;
  qttGame: any;
  HwFastappObject: any;
  hy_wy_sdk: any;
  hGame: any;
  CY_GAME_SDK: any;
  Game35: any;
  sharepay: any;
  Game9G: any;
  DownjoySdk: any;
  JxwSv: any;
  ZKSDK: any;
  share_game: any;
  RASTAR: any;
  FH_H5_SDK: string;
  qhsdk: any;
  TopSuper: any;
  lq: any;
  CyUsdkHelper: any;
  Wan511SDK: any;
  AiwanSDK: any;
  MKSDK: any;
  HuoSdk: any;
  [propName: string]: any;
}
