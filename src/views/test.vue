<template>
  <div>
    <btn  text="set Cookie" @click="inCookie" />
    <btn :style="{marginTop: '15px' }" text="set localStorage" @click="inStorage" />
    <btn :style="{marginTop: '15px' }" text="set in app" @click="inApp" />
    <btn :style="{marginTop: '15px' }" text="get Cookie" @click="outCookie" />
    <btn :style="{marginTop: '15px' }" text="get localStorage" @click="outStorage" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Cookies from 'js-cookie';
import { expireDays } from '@/config';
import Btn from '@/components/core/btn/index.vue';
import isAndroid from '@/utils/ts/device/isAndroid';
import { setCookie, getCookie } from '@/utils/ts/cookies';

@Component({
  components: {
    Btn
  }
})
export default class Test extends Vue {
  private inCookie() {
    setCookie('inCookie', 'here is cookie', expireDays);
    console.log('set cookie success');
  }
  private inStorage() {
    window.localStorage.setItem('inStorage', 'here is localStorage');
    console.log('set localStorage success');
  }
  private inApp() {
    if (isAndroid && window.android.update) {
      setTimeout(() => window.android.update('here use app storage'), 200);
    }
    console.log('set app success');
  }
  private outStorage() {
    console.log(window.localStorage.getItem('inStorage'));
    // alert(window.localStorage.getItem('inStorage'));
  }
  private outCookie() {
    console.log(getCookie('inCookie'));
    alert(getCookie('inCookie'));
  }
  private created() {
    console.log('created', getCookie('inCookie'));
    this.outStorage();
  }
  private mounted() {
    console.log('mounted', getCookie('inCookie')); 
    this.outStorage();
    this.outCookie();
  }
}
</script>