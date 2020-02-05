## 更新日志

### 2019.12.31
- Bug
  - 修复分享参数问题
  - 修复辉耀渠道投放第三方app包时，隐藏联系客服按钮（在不支持打开浏览器方法时）
  
- 开启线上防沉迷功能
- 新增/sw?io=xxx&an=xxx&ctype=xxx&mapp=xxx二合一链接
  - 参数说明：
    - io：ios端
    - an：安卓端
    - ctype：渠道类型
    - mapp：是否app端
  - ctype=hy_[xxx] 时表示辉耀第三方包或者第三方渠道
  - mapp=1 时表示app端内，表现在支付时会弹出支付面板，并且支付时会拉起原生支付app。仅且当在app内才可使用此参数。
- 新增界面组件
  - 登录
  - 中心面板
  - 账号管理
- 新增元组件：
  - 按钮
  - 标签
  - 徽标
  - 加载提示
  - toast提示
  - 输入表单项
  - svgIcon
  - 弹窗
  - 拖拽
  - 表单