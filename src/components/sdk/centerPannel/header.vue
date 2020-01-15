<template>
	<div class="header">
		<div class="top">
			<div class="user-avatar" :style="style"></div>
			<ul class="user-info">
				<li>
					<a @click="handleClick('account')">[账号管理]</a>
					<span v-if="certified">[已实名认证]</span>
					<a v-else @click="handleClick('certify')">[实名认证]</a>
				</li>
				<li>账号：{{ username }}</li>
			</ul>
			<a v-if="!!sdkOptions.mapp && /hy$/ig.test(sdkOptions.ctype)" class="kefu" @click.prevent="handleClick('kefu')">联系客服</a>
			<a v-else-if="!sdkOptions.mapp && !isWx" class="kefu" :href="kefuLink" target="_blank">联系客服</a>
		</div>
		<ul class="current" :style="{backgroundImage: `url(${require('@/assets/sdk/center/gl-panel-server.jpg')})`}">
			<li>
				<p>您正在玩：{{ gameName }}</p>
			</li>
		</ul>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import isWx from '@/utils/ts/device/isWx';

@Component({
	computed: {
		...mapState('sdk', {
			username: (state: any) => state.user.username,
			gameName: (state: any) => state.game.name,
			certified: (state: any) => state.user.age > -1,
			kefuLink: (state: any) => state.game.kefu.link,
		})
	}
})
export default class CHeader extends Vue {
	@Prop({
		type: Object,
		default: () => ({})
	})
	private sdkOptions!: { [propName: string]: any };

	private data() {
		return {
			isWx,
			style: {
				backgroundImage: `url(${require('@/assets/sdk/center/avatar.png')})`
			}
		};
	}

	// methods
	private handleClick(type: string) {
		this.$emit('handle', type);
	}
}
</script>
<style lang="scss" scoped>
.header {
	position: relative;
	.top {
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 10px 12px;
	}
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
	.kefu {
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
	.current {
		padding: 0 12px;
    background-position: center;
		background-repeat: no-repeat;
		background-size: 100% auto;
		li {
			padding: 11px 0;
			font-size: 13px;
			line-height: 1;
			color: #333;
		}
	}
}
</style>
