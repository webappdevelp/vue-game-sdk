<template>
  <msg-box
    title="温馨提示"
    :show="show"
    :closeable="false">
    <div slot="body">
      <div class="fastreg">
        <h4>请牢记您的账号密码！</h4>
        <ul>
          <li>账号：{{ user.username }}</li>
          <li>密码：******</li>
        </ul>
        <btn text="开始游戏" @click="cancel"/>
      </div>
    </div>
    <span slot="footer"></span>
  </msg-box>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MsgBox from '@/components/core/msgBox/index.vue';
import Btn from '@/components/core/btn/index.vue';
import { UPDATEUSERINFO } from '@/store/types';
let timerInterval: any = null;
let timer: number = 35;

@Component({
  components: {
    MsgBox,
    Btn
  },
  computed: {
    ...mapState('sdk', {
      user: (state: any) => state.user,
      show(state: any) {
        const { step } = state.user;
        return step === 'fastReg';
      }
    })
  }
})
export default class HyModal extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  })
  private sdkOptions!: { [props: string]: any };

  // 开始游戏
  private cancel() {
    this.$store.commit(`sdk/${UPDATEUSERINFO}`, { step: 'logined' });
    this.$store.dispatch('sdk/reportOnlineTime', this.sdkOptions);
  }
}
</script>
<style lang="scss" scoped>
.fastreg {
  position: relative;
  padding: 0 12px 12px;
  overflow: hidden;
  &-header {
    position: relative;
    margin: 0;
    position: relative;
    margin-top: 20px;
    font-size: 18px;
    font-weight: 400;
    color: #333;
    text-align: center;
    user-select: none;
  }
  &-body {
    padding-top: 20px;
    width: 100%;
    overflow: hidden;
  }
  h4 {
    color: #e73c00;
    font-weight: 400;
    font-size: 15px;
    text-align: center;
  }
  ul {
    margin: 15px 0;
  }
  li {
    font-size: 14px;
    line-height: 2;
    text-indent: 25%;
  }
}
</style>
