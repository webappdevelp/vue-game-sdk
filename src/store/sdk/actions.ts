import deviceInit from './actions/deviceInit';
import getGame from './actions/getGame';
import fastReg from './actions/fastReg';
import mobileLogin from './actions/mobileLogin';
import getVerifyCode from './actions/getVerifyCode';
import login from './actions/login';
import loginU9 from './actions/loginU9';
import changePsw from './actions/changePsw';
import checkApiToken from './actions/checkApiToken';
import checkU9Token from './actions/checkU9Token';
import getServiceInfo from './actions/serviceInfo';
import bindMobile from './actions/bindMobile';
import pay from './actions/pay';
import pppCheck from './actions/pppCheck';
import createU9Order from './actions/createU9Order';
import wxPay from './actions/wxPay';
import getOrder from './actions/getOrder';
import getOrderState from './actions/getOrderState';
import logOut from './actions/logOut';
import logReport from './actions/logReport';
import roleReport from './actions/roleReport';
import csReport from './actions/csReport';
import verifyName from './actions/verifyName';
import reportOnlineTime from './actions/onlineTimeReport';

const actions = {
  // 设备初始化
  deviceInit,
  // 获取游戏数据
  getGame,
  // 快速注册
  fastReg,
  // 手机号登录注册
  mobileLogin,
  // 登录平台
  login,
  // 登录u9
  loginU9,

  // 校验登录
  checkApiToken,
  checkU9Token,

  // 支付检查并创建订单
  pay,
  pppCheck,
  createU9Order,
  wxPay,
  getOrder,
  getOrderState,

  // 实名认证
  verifyName,
  reportOnlineTime,

  // 获取服务信息
  getServiceInfo,

  // 日志上报
  logReport,
  roleReport,
  csReport,

  // 获取短信验证码
  getVerifyCode,
  // 绑定手机号
  bindMobile,

  // 更改密码
  changePsw,

  // 退出登录
  logOut

};

export default actions;
