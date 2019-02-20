<template>
  <label class="hy-input">
    <Icon :name="icon" />
    <input
      :ref="name"
      :type="type"
      :id="name"
      :name="name"
      :value="value"
      @input="change"
      :placeholder="placeholder"
      autocomplete="off"
    />
    <Icon v-if="showClear" name="clear" @click="clearValue(name)"/>
    <Icon v-if="showPsw" :name="eye" @click="changeType" />
  </label>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';
@Component({
  components: {
    Icon
  }
})
export default class HyInput extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private icon!: string;
  @Prop({
    type: String,
    default: 'text'
  })
  private type!: string;
  @Prop({
    type: String,
    default: ''
  })
  private name!: string;
  @Prop({
    type: String,
    default: ''
  })
  private value!: string;
  @Prop({
    type: String,
    default: '请输入'
  })
  private placeholder!: string;
  @Prop({
    type: Boolean,
    default: false
  })
  private showPsw!: boolean;

  private data() {
    return {
      showClear: false,
      eye: 'eye'
    };
  }

  // methods
  private change(e: any) {
    if (e.target.value) {
      this.$data.showClear = true;
    } else {
      this.$data.showClear = false;
    }
    this.$emit('input', e.target.value);
  }
  private clearValue(name: string) {
    const el = this.$refs[name] as HTMLInputElement;
    el.value = '';
    this.$data.showClear = false;
    this.$emit('input', '');
  }
  private changeType() {
    if (this.type === 'password') {
      this.$data.eye = 'open-eye';
      this.$emit('update:type', 'text');
    } else {
      this.$data.eye = 'eye';
      this.$emit('update:type', 'password');
    }
  }
}
</script>
<style lang="scss">
.hy-input {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow: hidden;
  .hy-icon + input {
    margin-left: 5px;
  }
  input + .hy-icon {
    margin-left: 5px;
    &:active {
      background-color: #dadada;
    }
  }
  input {
    flex: 1;
    width: 100%;
    height: 30px;
    font-size: 15px;
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
    box-sizing: border-box;
  }
  input::-webkit-input-placeholder {
    font-size: 100%;
    color: #999;
    line-height: 1.2;
  }
}
</style>
