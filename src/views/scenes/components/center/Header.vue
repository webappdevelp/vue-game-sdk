<template>
	<div class="hy-center-header">
		<div class="user-avatar" :style="style"></div>
		<ul class="user-info">
			<li>
				<a href="javascript:;" @click="action('account')">[账号管理]</a>
				<a v-if="showCertify" href="javascript:;" @click="action('verifyName')">[实名认证]</a>
				<span v-else-if="certified">[已实名认证]</span>
			</li>
			<li>账号：{{ datas.username }}</li>
		</ul>
		<a
			v-if="extDatas && !/hy_/ig.test(extDatas.ctype)"
			class="wxtip" 
			@click="action('wxTip')">
			联系客服
		</a>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { mapState } from 'vuex';
@Component({
	computed: {
		...mapState('user', {
			// 实名认证
			showCertify(state: any) {
				const { age } = state.userCertify;
				return age === -1 || typeof age === 'undefined';
			},
			certified(state: any) {
				const { age } = state.userCertify;
				return age > -1;
			}
		})
	}
})
export default class HyCenterHeader extends Vue {
	@Prop({
		type: Object,
		default: () => {
			return {};
		}
	})
	private datas!: object;
	@Prop({
		type: Object,
		default: () => {}
	})
	private extDatas!: object;

	private data() {
		return {
			style: {
				backgroundImage: `url(${require('@/assets/scenes/avatar.png')})`
			}
		};
	}

	// methods
	@Emit()
	private action(action: string) {
		if (action === 'wxTip') {
			return {
				action,
				params: '这样玩游戏和聊天就可以同时进行。'
			};
		}
		return {
			action
		};
	}
}
</script>
<style lang="scss" scoped>
.hy-center-header {
	position: relative;
	padding: 10px 12px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	.user-avatar {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		overflow: hidden;
	}
	.user-info {
		flex: 1;
		padding-left: 10px;
		font-size: 12px;
		color: #999;
		li {
			line-height: 24px;
		}
		a {
			color: #018ffd;
			font-size: 13px;
			text-decoration: none;
		}
		a + a,
		a + span {
			margin-left: 10px;
		}
	}
	.wxtip {
		position: absolute;
		top: 50%;
		right: 12px;
		padding: 2px 5px;
		font-size: 12px;
		border: 1px solid #ebc89e;
		border-radius: 10px;
		color: #a16945;
		background: #f5ddc0;
		overflow: hidden;
		transform: translate3d(0, -50%, 0);
	}
}
@media screen and (max-width: 320px) {
	.hy-center-header {
		.user-info a {
			font-size: 12px;
		}
	}
}
</style>
