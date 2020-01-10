<template>
	<transition name="fade" type="animation">
		<div v-show="show" :class="msgClass">{{ msg }}</div>
	</transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { UPDATEMSG } from '@/store/types';
let timer: any = null;

@Component({
	computed: {
		...mapState('global', {
			msg: (state: any) => state.msg.content,
      show(state: any) {
        if (state.msg.show) {
          this.hide()
        }
        return state.msg.show
      },
			msgClass(state: any) {
				return state.msg.content ? `msg ${state.msg.type}` : 'msg';
			}
		})
	}
})
export default class Msg extends Vue {
	@Prop({
		type: Number,
		default: 2000
	})
	private duration!: number;

	private hide() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		timer = setTimeout(() => {
			this.$store.commit(`global/${UPDATEMSG}`, { show: false });
		}, this.duration);
	}
	private beforeDestroy() {
		clearTimeout(timer);
		timer = null;
	}
}
</script>

<style lang="scss" scoped>
.msg {
  position: fixed;
  z-index: 1100;
  top: 50%;
  left: 50%;
  max-width: 65%;
  text-align: center;
  line-height: 1;
  padding: 8px 12px;
  word-break: break-all;
  background: rgba(46, 46, 46, 0.46);
  border-radius: 4px;
  box-sizing: border-box;
  color: #fff;
  font-size: 14px; /*px*/
  transform: translate3d(-50%, -50%, 0);
  will-change: auto;
}
.fade-enter-active {
  animation: fadeIn 0.3s;
}
.fade-leave-active {
  animation: fadeOut 0.3s;
}
@keyframes fadeIn {
  from {
    transform: translate3d(-50%, 100%, 0);
    opacity: 0;
    visibility: hidden;
  }
  to {
    transform: translate3d(-50%, -50%, 0);
    opacity: 1;
    visibility: visible;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>