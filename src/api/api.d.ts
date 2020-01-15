/**
 * api请求公参
 * aid: 广告计划ID
 * start_origin：api源（广州、深圳、高瑞发），
 * 不同的源对应不同的接口请求以及用户存储标识
 *  */
export interface ApiCommonOptions {
  start_origin: string;
  sdk_version: number;
  app_id: string;
  app: string;
  channel_id: string;
  channel: string;
  aid: string;
  device: number;
  zoneid?: number;
  roleid?: number;
}

/**
 * api设备初始化参数说明:
 * brand: 手机厂商，微信内则标识“公众号”；
 * brand_desc: 手机品牌详情，微信内则标识“公众号”;
 * imei: 设备imei，微信授权则使用openid作为imei；
 * idfa: ios设备 idfa；
 * type: 设备型号, 0 安卓, 1 ios；
 * coordinate_lng: 坐标纬度；
 * coordinate_lat: 坐标经度；
 * tel_op: 运营商；
 * switch_origin: 是否切api，默认走u9设备初始化
 *  */

export interface DeviceInitOptions extends ApiCommonOptions {
  brand: string;
  brand_desc: string;
  imei: string;
  idfa: string;
  type: number;
  mobile: string;
  coordinate_lng: number;
  coordinate_lat: number;
  tel_op: string;
  http_origin?: string;
}

/**
 * api获取用户信息，可用来做用户是否存在判断
 */
export interface ApiUserInfoOptions extends ApiCommonOptions {
  username?: string;
}

/**
 * api校验用户登录token
 */
export interface ApiCheckTokenOptions extends ApiCommonOptions {
  token?: string;
  guid?: string;
}

/**
 * api一键(快速)注册
 * 参数说明:
 * password: 密码，使用MD5加密
 */
export interface ApiQuickRegisterOptions extends ApiCommonOptions {
  password?: string;
}

/**
 * api手机号注册登录
 */
export interface ApiMobileLoginOptions extends ApiCommonOptions {
  mobile?: number;
  code?: number;
}

/**
 * api账号密码登录
 */
export interface ApiSignInOptions extends ApiCommonOptions {
  username?: string;
  password?: string;
}

/**
 * api退出登录
 */
export interface ApiLogOutOptions extends ApiCommonOptions {
  token: string;
  guid: string;
}

/**
 * api获取短信验证码
 * 参数说明:
 * action: 行为，register: 注册登录，bind_mobile: 绑定手机号，reset_password: 重置密码
 */
export interface ApiGetMobileCodeOptions extends ApiCommonOptions {
  mobile: number;
  action: string;
}

/**
 * api更新密码
 */
export interface ApiUpdatePswOptions extends ApiCommonOptions {
  old_password?: string;
  password: string;
  re_password?: string;
  token: string;
  guid: string;
}

/**
 * api重置密码
 */
export interface ApiResetPswOptions extends ApiCommonOptions {
  password: string;
  old_password?: string;
  re_password?: string;
  mobile?: number;
  code?: number;
  token: string;
  guid: string;
}

/**
 * api绑定手机号
 */
export interface ApiBindMobileOptions extends ApiCommonOptions {
  mobile: number;
  code: number;
  token: string;
  guid: string;
}

/**
 * api日志上报
 */
export interface ApiLogReportOptions extends ApiCommonOptions {
  brand: string;
  brand_desc: string;
  time: number;
  step: number;
  step_desc: string;
}

/**
 * api 生成订单号
 * 只有IOS流程时，调用此接口生成订单ID
 * 参数说明：
 * total_fee: 支付总金额，单位(分)
 */
export interface ApiPPPCheckOptions extends ApiCommonOptions {
  total_fee: number;
  u9uid: string;
}


/**
 * api 支付检查 - 是否开启支付限制
 * 参数说明：
 * total_fee: 支付总金额，单位（分）
 * 
 */
export interface ApiCheckPayOPtions extends ApiCommonOptions {
  amount: number | string;
  guid: string;
  total_fee: number | string;
  api_version?: number | string;
}

/**
 * api获取订单信息及支付参数说明:
 * app_order_id: CP生成的商品订单ID；
 * order_id: 渠道生成的商品订单ID；
 * amount: 支付金额，单位(分)；
 * subject: 商品名称；
 * body: 商品描述；
 * callback_url: 支付回调通知, 用于支付成功后通知CP完成支付；
 * http_source: 请求来源，JSAPI 微信jssdk，web 网页；
 * pay_channel: 支付渠道，WXPAY 微信支付，ALIPAY 支付宝，APPLEPAY 苹果支付；
 * app_ext: CP支付透传字段(扩展字段)；
 * ext: 渠道支付透传字段(扩展字段)；
 */
export interface ApiGetOrderOptions extends ApiCommonOptions {
  guid: string;
  token: string;
  u9uid: string;
  openid: string;
  app_order_id: string;
  order_id: string;
  device_id: number;
  amount: number;
  subject: string;
  body: string;
  callback_url: string;
  http_source?: string;
  pay_channel?: string;
  app_ext: string;
  ext: string;
  is_native_payment?: number;
}

/**
 * api网页支付参数说明
 * u9uid: 默认为999
 * order_id: 只有ios流程时，值为api/ppp/check下单接口返回的order_id，对应app_order_id 则为CP订单ID。否则由SDK随机生成；
 * app_order_id: 只有ios流程时为CP订单ID，否则为u9生成的订单ID；
 * callback_url: CP支付回调通知接口；
 * amount: 支付金额，单位(分)；
 * subject：商品名称；
 * body: 商品描述
 * app_ext: CP支付透传字段(扩展字段)；
 * ext: SDK支付透传字段(扩展字段)；
 * isSwitchPayChannel: 是否切支付，H5固定值为1；
 */
export interface ApiPayIndexOptions extends ApiCommonOptions {
  guid: string;
  token: string;
  u9uid: string;
  order_id?: string;
  app_order_id: string;
  amount: number;
  subject: string;
  body: string;
  callback_url: string;
  app_ext: string;
  ext: string;
  isSwitchPayChannel?: number;
}

/**
 * api获取游戏及用户信息
 */
export interface ApiGetSysInfoOptions extends ApiCommonOptions {
  token: string;
  guid: string;
  from_action?: string;
}

/**
 * u9账号登录
 * 参数说明:
 * productId: app_id；
 * channelId: channel_id；
 * channelUserId: guid；
 * channelUserName: username；
 */
export interface U9SignInOptions extends ApiCommonOptions {
  productId: string;
  channelId: string;
  token?: string;
  guid?: string;
  username?: string;
  channelUserId?: string;
  channelUserName?: string;
}

/**
 * u9登录校验
 */
export interface U9CheckTokenOptions extends ApiCommonOptions {
  guid?: string;
  userId: string;
  token: string;
}

/**
 * u9生成订单号
 * 参数说明：
 * productId: app_id；
 * channelId: channel_id；
 * productOrderId: CP 订单ID；
 * callbackUrl: CP通知发货地址；
 * appExt: CP透传字段(扩展字段)；
 * ext: SDK透传字段(扩展字段)；
 * isSwitchPayChannel: 是否切支付，H5固定值为1；
 */
export interface U9CreateOrderOptions extends ApiCommonOptions {
  productId: string;
  channelId: string;
  userId: string;
  productOrderId: string;
  amount: number;
  callbackUrl: string;
  appExt: string;
  ext: string;
  deviceId: number;
  isSwitchPayChannel?: number;
}

/**
 * u9角色上报
 * partyName: 帮派名称
 */
export interface U9RoleReportOptions extends ApiCommonOptions {
  userId: string;
  roleId: number;
  roleName: string;
  roleLevel: number;
  zoneId: number;
  zoneName: string;
  blance: string;
  vip: number;
  partyName: string;
}

/**
 * cs 打点上报参数说明：
 * type: 1 登录，2 退出，3 下单，4 游戏币消耗，5 其他途径获取游戏币，6 绑定手机，7 聊天
 * is_role_create 是否新建角色: 0 不是，1 是；
 * 参考 CS打点文档
 */
export interface CSReportOptions extends ApiCommonOptions {
  type: number;
  token: string;
  guid: string;
  u9uid: string;
  userid: string;
  roleid: number;
  zoneid: number;
  imei: string;
  zone_id: number;
  role_id: number;
  zone_name: string;
  role_name: string;
  party_name: string;
  left_coin: number;
  is_role_create?: number;
  get_item?: string;
  amount?: number;
  total_amount?: number;
  first_pay?: number;
  buy_channel?: string;
  use_coin?: number;
  reason?: string;
  coin_count?: number;
  mobile?: string;
  chat_area?: string;
  chat_area_id?: string;
  chat_content?: string;
  chat_to?: string;
}
