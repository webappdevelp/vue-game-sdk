<template>
  <modal :show="show">
    <div class="hy-amanger">
      <Icon name="close" @click="hide"/>
      <div class="hy-amanger-header">账号管理</div>
      <div class="hy-amanger-body">
        <ul class="hy-amanger-ul">
          <li v-for="(item, index) in items" :key="index" @click="action(item.type)">
            <Icon :name="item.icon"/>
            <div class="hy-amanger-li">
              <span>{{ item.name }}</span>
              <span v-if="item.type === 'mobile' && !datas.user.mobile" class="red-dot"></span>
              <span v-else-if="item.type === 'mobile' && !!datas.user.mobile" class="sub-text">已绑定</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </modal>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Icon from '@/components/Icon.vue';
@Component({
  components: {
    Modal,
    Icon
  }
})
export default class HyAccountManger extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private datas!: {
    user: {
      mobile: '';
    };
  };

  private data() {
    return {
      items: [
        { type: 'mobile', name: '绑定手机号', icon: 'mobile__w', link: '' },
        { type: 'psw', name: '修改密码', icon: 'lock__w', link: '' },
        { type: 'logOut', name: '切换账号', icon: 'switch__w', link: '' },
      ]
    };
  }

  // methods
  private hide() {
    this.$emit('update:show', false);
  }
  // 切换控制面板
  private action(type: string) {
    if (type === 'mobile' && !!this.datas.user.mobile) {
      return;
    }
    this.hide();
    this.$emit('action', type);
  }
}
</script>
<style lang="scss" scoped>
.hy-amanger {
  position: relative;
  padding: 0 0 20px;
  overflow: hidden;
  .hy-icon-close {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  &-header {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    color: #333;
  }
  &-ul {
    padding: 20px 20px 0;
    max-height: 160px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .hy-icon {
      max-width: 40px;
      background-color: #5eb633;
      background-size: 80%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  &-ul li {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    line-height: 40px;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 5px;
      height: 8px;
      width: 8px;
      border-width: 2px;
      border-style: dashed solid solid dashed;
      border-color: transparent #666 #666 transparent;
      transform: translate3d(0, -50%, 0) rotate(-45deg);
    }
  }
  &-li {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px 0 14px;
    font-size: 14px;
    color: #333;
  }
  .red-dot {
    margin: -1em 0 0 0.35em;
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #e73c00;
    border-radius: 50%;
    overflow: hidden;
  }
  .sub-text {
    flex: 1;
    direction: rtl;
    text-align: right;
    font-size: 12px;
    color: #999;
  }
  &-ul li + li {
    border-top: 1px solid #ddd;
  }
}
</style>
