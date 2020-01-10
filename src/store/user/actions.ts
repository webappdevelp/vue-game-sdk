import deviceInit from './actions/deviceInit';
import login from './actions/login';
import loginGame from './actions/loginGame';
import checkApiToken from './actions/checkApiToken';
import checkU9Token from './actions/checkU9Token';
import getVerifyCode from './actions/getVerifyCode';
import getServiceInfo from './actions/serviceInfo';
import bindMobile from './actions/bindMobile';
import resetPassword from './actions/resetPassword';
import updatePassword from './actions/updatePassword';
import logOut from './actions/logOut';
import logReport from './actions/logReport';
import roleReport from './actions/roleReport';
import csReport from './actions/csReport';
import verifyName from './actions/verifyName';
import reportOnlineTime from './actions/onlineTimeReport';

const actions = {
  // 设备初始化
  deviceInit,

  // 登录平台
  login,
  // 登录u9
  loginGame,

  // 校验登录
  checkApiToken,
  checkU9Token,

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
  updatePassword,
  resetPassword,

  // 退出登录
  logOut

};

export default actions;
