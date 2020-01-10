<template>
	<div>
		<transition name="fade" type="animation">
			<div v-show="show" class="mask" @click="closeCenter"></div>
		</transition>
		<transition name="left" type="animation">
			<div v-show="show" class="center">
				<c-header :sdk-options="sdkOptions" @handle="handleClick" />
				<c-body />
				<div class="control">
					<a @click="closeCenter">
						<svg-icon icon-class="up" class-name="icon up" />
					</a>
					<a @click="refresh">
						<svg-icon icon-class="sync" class-name="icon" />
						刷新游戏
					</a>
				</div>
			</div>
		</transition>
		<manager
      :show.sync="showManager"
      :sdk-options="sdkOptions"
      @bindMobile="bindMobile"
			@changePsw="changePsw"
    />
		<!-- <wx-tip :show.sync="showWxTip" /> -->
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MD5 from 'md5';
import CHeader from './header.vue';
import CBody from './body.vue';
import Manager from './manager.vue';
import WxTip from './wxTip.vue';
import openBrowser from '@/utils/ts/openBrowser';
import { UPDATECERTIFY } from '@/store/types';

@Component({
	components: {
		CHeader,
		CBody,
		Manager,
		WxTip
	}
})
export default class Center extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  @Prop({
    type: Object,
    default: () => ({})
  })
  private sdkOptions!: { [propName: string]: any };

	private data() {
		return {
			showManager: false,
			showWxTip: false
		};
	}

	// methods
	private handleClick(action: string) {
		switch (action) {
			case 'account':
				this.$data.showManager = true;
				this.closeCenter();
				break;
			case 'certify':
				this.closeCenter();
				this.$store.commit(`sdk/${UPDATECERTIFY}`, { step: 'auth' });
				break;
			case 'kefu':
				const game = this.$store.getters['sdk/game'];
				const link = game.kefu.link;
				if (link) {
					openBrowser(!!this.sdkOptions.mapp, link);
				}
				break;
		}
  }
  // 绑定手机号
  private async bindMobile(params: any = {}) {
    await this.$store.dispatch('sdk/bindMobile', {
      ...this.sdkOptions,
      ...params
    });
	}
	// 修改密码
	private async changePsw(params: any = {}) {
		params.password = MD5(params.password);
    params.re_password && (params.re_password = MD5(params.re_password));
    params.old_password && (params.old_password = MD5(params.old_password));
    await this.$store.dispatch('sdk/changePsw', {
      ...this.sdkOptions,
      ...params
    });
	}
  // 关闭中心面板
  private closeCenter() {
    this.$emit('update:show', false);
  }
  // 刷新页面
  private refresh() {
    window.location.reload();
  }
}
</script>

<style lang="scss" scoped>
.mask {
	position: fixed;
	z-index: 109;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.46);
}
.center {
	position: fixed;
	z-index: 110;
	top: 0;
	bottom: 0;
	left: 0;
	height: 100%;
	width: 85%;
	max-width: 450px;
	background: #fff;
	will-change: auto;
}
.control {
	position: absolute;
	right: -28px;
	top: 50%;
	transform: translate3d(0, -50%, 0);
	a {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 13px;
		min-height: 78px;
		width: 28px;
		padding: 10px 0;
		border-radius: 0 5px 5px 0;
		box-sizing: border-box;
		background: #f5f5f5;
		overflow: hidden;
		.icon {
			width: 18px;
			height: 18px;
		}
		.icon.up {
			transform: rotate(-90deg);
		}
	}
	a + a {
		margin-top: 20px;
		color: #926b43;
		word-break: break-all;
		writing-mode: vertical-lr;
		background: #f5dec6;
	}
}

.fade-enter-active {
  animation: fadeIn 0.3s;
}
.fade-leave-active {
  animation: fadeOut 0.3s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.left-enter-active {
  animation: leftIn 0.4s forwards;
}
.left-leave-active {
  animation: leftOut 0.4s forwards;
}
@keyframes leftIn {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translate(-120%, 0);
  }
  to {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
  }
}
@keyframes leftOut {
  from {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(-120%, 0);
  }
}
</style>