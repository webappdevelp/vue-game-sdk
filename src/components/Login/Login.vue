<template>
  <form class="hy-modal hy-login" onsubmit="submitForm(this); return false;">
    <div id="hy-modal__close" class="hy-icon hy-icon-close hy-close" onclick="hideModals();"></div>
    <h2 class="hy-modal__header">普通账号登录</h2>
    <div class="hy-modal__body">
      <div class="hy-form-item">
        <div class="hy-input">
          <label for="username" class="hy-icon hy-icon-account"></label>
          <input
            type="text"
            id="username"
            name="username"
            value=""
            oninput="inputChange(this);"
            placeholder="请输入账号"
            autocomplete="off"
          />
          <label
            for="username"
            class="hy-icon hy-icon-clear"
            onclick="clearVal(this);"
            style="display: none;"
          ></label>
        </div>
      </div>
      <div class="hy-form-item">
        <div class="hy-input">
          <label for="password" class="hy-icon hy-icon-psw"></label>
          <input
            type="password"
            id="password"
            name="password"
            value=""
            oninput="inputChange(this);"
            placeholder="请输入密码"
            autocomplete="off"
          />
          <label
            for="password"
            class="hy-icon hy-icon-clear"
            onclick="clearVal(this);"
            style="display: none;"
          ></label>
          <div class="hy-icon hy-icon-eye" onclick="showPsw(this);"></div>
        </div>
      </div>
      <button type="submit" class="hy-btn">立即登录</button>
    </div>
    <div class="hy-modal__footer">
      <div class="hy-btn hy-btn--green" onclick="switchSign('hy-mobile');">
        手机号登录
      </div>
      <div class="hy-btn hy-btn--purple" onclick="fastLogin();">
        一键注册
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  
})
</script>
<style lang="scss" scoped>

</style>
