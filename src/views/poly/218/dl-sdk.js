(function(window, document) {
  /**
   * 初始化当乐sdk
   * @param config 初始化参数
   */
  var DownjoySdk = function(config) {
    var _self = this;
    this.dlDomain = '*';
    this.version = '1.0.0';
    this.messageWindow = window.top;

    //添加消息监听
    window.addEventListener(
      'message',
      function(event) {
        var regex = new RegExp('h5sdk.d.cn', 'i');
        if (regex.exec(event.origin) != null) {
          _self.messageHandler(event.data);
        }
      },
      false
    );
  };

  /**
   * sdk接口定义
   */
  DownjoySdk.prototype = {
    /**
     * 游戏内支付接口
     * @param payData 支付信息
     * @param callback 支付回调方法
     */
    pay: function(payData, callback) {
      if ('undefined' != payData && typeof payData == 'object') {
        payData.version = this.version;
      }
      var message = {
        action: 'pay',
        data: {
          payData: payData
        }
      };
      this.sendMessage(message, this.dlDomain);
      this.afterPay = callback;
    },

    /**
     * 游戏内分享接口
     * @param string title 分享的文字
     */
    share: function(title, callback) {
      var message = {
        action: 'share',
        data: {
          title: title
        }
      };
      this.sendMessage(message, this.dlDomain);
      this.afterShare = callback;
    },

    /**
     * 游戏登录，一般不需要调用，当前登录超时才触发
     */
    login: function() {
      var message = {
        action: 'login',
        data: {}
      };
      this.sendMessage(message, this.dlDomain);
    },

    /**
     * 消息发送方法
     * @param message 消息体
     * @param dlDomain 发送对象域名
     */
    sendMessage: function(message, dlDomain) {
      var iframe = this.messageWindow;
      if (typeof iframe !== 'undefined') {
        iframe.postMessage(message, dlDomain);
      } else {
        //报错
        alert('没有找到顶层消息窗口');
      }
    },

    /**
     * 消息接受后执行
     * @param message 消息体
     */
    messageHandler: function(message) {
      if (typeof message != 'object') {
        console.log('消息体格式不正确');
        return;
      }
      if (typeof message.data != 'object' && typeof message.data != 'string') {
        console.log('消息体格式不正确');
        return;
      }
      var data = {
        code: -1,
        message: '',
        data: {}
      };
      try {
        if (typeof message.data == 'string') {
          data = JSON.parse(message.data);
        } else {
          data = message.data;
        }
      } catch (ex) {
        console.log('parse data error:', ex.message);
      }

      switch (message.action) {
        case 'pay':
          this.payCallback(data);
          break;
        case 'share':
          this.shareCallback(data);
          break;
        default:
          break;
      }
    },

    /**
     * 支付完成后进行回调
     */
    payCallback: function(data) {
      if (this.afterPay != undefined) {
        this.afterPay.apply(this, [data]);
      }
    },

    /**
     * 分享完成后进行回调
     */
    shareCallback: function(data) {
      if (this.afterShare != undefined) {
        this.afterShare.apply(this, [data]);
      }
    }
  };

  window.DownjoySdk = DownjoySdk;
})(window, document);
