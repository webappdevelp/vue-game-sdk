<template>
  <label class="input">
    <slot name="prefix">
      <svg-icon v-if="prefixIcon" :icon-class="prefixIcon" class-name="icon prefix" />
    </slot>
    <input
      :ref="name"
      :name="name"
      :type="currentType"
      :placeholder="placeholder"
      :value="value"
      :autocomplete="autocomplete"
      @input="change"
    />
    <slot name="suffix">
      <svg-icon v-if="clearable && value" icon-class="clear" @click="clear" class-name="icon suffix" />
      <svg-icon v-if="currentSuffixIcon" :icon-class="currentSuffixIcon" class-name="icon suffix" @click="switchSuffixIcon" />
    </slot>
  </label>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Input extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private name!: string;

  @Prop({
    type: String,
    default: 'text'
  })
  private type!: string;

  @Prop({
    type: String,
    default: ''
  })
  private switchedType!: string;

  @Prop({
    type: String,
    default: '请输入'
  })
  private placeholder!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  private autocomplete!: boolean;

  @Prop({
    type: [String, Number]
  })
  private value!: string | number;

  @Prop({
    type: String,
    default: ''
  })
  private prefixIcon!: string;

  @Prop({
    type: String,
    default: ''
  })
  private suffixIcon!: string;

  @Prop({
    type: String,
    default: ''
  })
  private switchedSuffixIcon!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  private clearable!: boolean;

  private data() {
    return {
      currentType: this.type,
      currentSuffixIcon: this.suffixIcon
    }
  }

  private change(e: any) {
    this.$emit('input', e.target.value);
  }

  private clear() {
    const el = this.$refs[this.name] as HTMLInputElement;
    el.value = '';
    this.$emit('input', null);
  }

  private switchSuffixIcon() {
    const { currentSuffixIcon, currentType } = this.$data;
    if (this.switchedSuffixIcon && currentSuffixIcon !== this.switchedSuffixIcon) {
      this.$data.currentSuffixIcon = this.switchedSuffixIcon;
      this.$data.currentType = this.switchedType;
    } else if (currentSuffixIcon !== this.suffixIcon) {
      this.$data.currentSuffixIcon = this.suffixIcon;
      this.$data.currentType = this.type;
    }
  }

}
</script>

<style lang="scss" scoped>
.input {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid #dfdfdf;
  border-radius: 20px;
  overflow: hidden;
  input {
    flex: 1;
    width: 100%;
    height: 30px;
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
    box-sizing: border-box;
  }
  input::-webkit-input-placeholder {
    font-size: 100%;
    color: #999;
    line-height: 1.2;
  }
  .icon {
    font-size: 22px;
  }
  .prefix {
    color: #999;
  }
  .suffix {
    color: #666;
  }
  .icon + input,
  input + .icon {
    margin-left: 8px;
  }
}
</style>