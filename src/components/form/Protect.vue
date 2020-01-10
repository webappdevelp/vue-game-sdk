<template>
  <modal :show="show" animate="fade">
    <div ref="protect" class="hy-form">
      <Icon name="close" @click="hide"/>
      <div class="hy-form-header">实名制信息认证</div>
      <div class="protect-tips">
        根据国家相关规定, 游戏用户需进行实名认证, 否则后续将<span>无法正常游戏</span>
      </div>
      <div class="hy-form-body">
        <div
          class="hy-form-item"
          v-for="(obj, key) in form"
          :key="key"
          :class="obj.msg !== '' ? 'error' : ''"
        >
          <hy-input
            :icon="obj.icon"
            v-model="obj.value"
            :name="key"
            :type.sync="obj.type"
            :placeholder="obj.placeholder"
          />
          <div v-if="obj.msg !== ''" class="hy-form-item--error">{{ obj.msg }}</div>
        </div>
        <btn style="width: 100%; margin-top: 10px;" text="提交认证" @click="submit" />
      </div>
      <div class="hy-form-footer">
        <p>根据<a href="http://www.sapprft.gov.cn/sapprft/contents/6588/407807.shtml">《关于防止未成年人沉迷网络游戏的通知》</a>, 游戏用户应使用有效身份证件实名认证, 我们承若将依法保护您的个人信息安全!</p>
      </div>
    </div>
  </modal>
</template>
<script lang="ts">
let tempForm: any = {};
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Icon from '@/components/Icon.vue';
import HyInput from '@/components/form/Input.vue';
import Btn from '@/components/Btn.vue';
import { validateForm } from '@/utils/ts/form';
import deepCopy from '@/utils/ts/deepCopy';
@Component({
  components: {
    Modal,
    Icon,
    HyInput,
    Btn
  }
})
export default class HyScenesProtect extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  private data() {
    return {
      form: {
        realname: {
          icon: 'account',
          type: 'text',
          placeholder: '请输入真实姓名',
          value: '',
          msg: ''
        },
        id_card: {
          icon: 'certificate',
          type: 'text',
          placeholder: '请输入二代身份证号码',
          value: '',
          msg: ''
        }
      }
    };
  }

  // watches
  @Watch('form', { deep: true })
  private changeForm(val: any, old: any) {
    for (const key in val) {
      if (val.hasOwnProperty(key) && !!tempForm[key] && val[key].value !== tempForm[key].value) {
        val[key].msg = '';
      }
    }
  }

  // methods
  /* private hide() {
    this.$emit('update:show', false);
  } */
  private hide() {
    this.$emit('hide');
  }
  private submit() {
    const { form } = this.$data;
    tempForm = deepCopy(form);
    const rules = {
      realname: [{ required: true, msg: '请输入真实姓名' }],
      id_card: [{ required: true, msg: '请输入二代身份证号码' }]
    };
    this.$data.form = validateForm(form, rules);
    const datas: any = {};
    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        if (!!form[key].msg) {
          return;
        }
        datas[key] = form[key].value;
      }
    }
    this.$emit('submit', { ...datas });
  }
}
</script>
<style lang="scss" scoped>
.hy-form {
  position: relative;
  padding: 0 20px 20px;
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
  .protect-tips {
    font-size: 14px;
    color: #666;
    padding: 12px 0 0;
    span {
      color: #e73c00;
    }
  }
  &-body {
    padding-top: 25px;
    width: 100%;
    overflow: hidden;
  }
  &-footer {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    p, a {
      font-size: 12px;
      color: #999;
    }
    a {
      text-decoration: underline;
    }
  }
  .hy-icon-close {
    position: absolute;
    z-index: 2;
    top: 8px;
    right: 8px;
  }
}

.hy-form-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  margin-bottom: 25px;
  border-bottom: 1px solid #f5f5f5;
  &.error {
    border-color: #e73c00;
  }
  &--error {
    position: absolute;
    z-index: 2;
    top: 30px;
    left: 0;
    padding-top: 5px;
    font-size: 11px;
    color: #e73c00;
  }
}
</style>
