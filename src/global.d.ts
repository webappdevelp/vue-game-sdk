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
  WeixinJSBridge: {
    invoke: (event: string, params?: any, cb?: (params: any) => void) => void;
  };
}
