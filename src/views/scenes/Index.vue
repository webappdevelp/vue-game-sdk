<template>
	<component :is="comId" :key="comId" :datas="datas" :game-datas="gameDatas">
	</component>
</template>
<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import Cookies from 'js-cookie';
import CommonMix from '@/mixins/common';
import Com154 from './154/Index.vue';
import Com190 from './190/Index.vue';
import Gaoruifa from './gaoruifa/Index.vue';
import isWx from '@/utils/ts/device/isWx';
import { post } from '@/utils/ts/fetch';
import switchApi from '@/api/switchApi';
import { expireDays } from '@/config';


@Component({
	components: {
		Com154,
		Com190,
		Gaoruifa
	}
})
export default class Index extends Mixins(CommonMix) {
	private data() {
		return {
			comId: '',
			datas: {},
			gameDatas: {}
		};
	}
	// 拉去游戏信息
	private async getPageDatas() {
		this.updateLoading(true);
		const { datas } = this.$data;
		const { aid, gid, channel } = datas;
		let pageDatas: any = null;
		try {
			const result = await post(`//aliyun.gaoruifa.cn/game/detail`, {
				datas: {
					aid,
					gid,
					channel
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			this.updateLoading(false);
			pageDatas = result.data || {};
		} catch (err) {
			this.updateLoading(false);
			this.updateToast(err && err.message);
		}
		return pageDatas;
	}
	// 获取页面初始化信息
	private async getInitData() {
		const { gameDatas, datas } = this.$data;
		const { device_type, channel } = datas;
		let urlParam = `origin=${window.location.hostname}`;
		urlParam += device_type ? `&device_type=${device_type}` : '';
		try {
			const result = await this.getPageDatas();
			if (result) {
				const { title, cp_origin, cp_url, gid, json_param } = result;
				// 判断是否微信内且授权
				const openid = Cookies.get('openid') || '';
				if (isWx && !openid) {
					return (window.location.href = `/user/wxAuth?callback_url=${encodeURIComponent(
						window.location.href
					)}&app_id=${gid}&channel_id=${channel}`);
				}

				const { sdkEnv } = json_param;
				if (sdkEnv) {
					const { cqApi } = switchApi(sdkEnv);
					if (cqApi && cqApi.indexOf(window.location.hostname) < 0) {
						return (window.location.href = `${window.location.href.replace(
							'//' + window.location.hostname,
							cqApi
						)}`);
					}
					this.$data.datas = {
						...datas,
						startOrigin: sdkEnv
					};
				}
				document.title = title;
				this.$data.gameDatas = {
					...gameDatas,
					id: gid,
					name: title,
					link:
						cp_url.indexOf('?') >= 0
							? `${cp_url}${urlParam ? '&' + urlParam : ''}`
							: `${cp_url}${urlParam ? '?' + urlParam : ''}`
				};
				// 设置账号登录信息，放在此出是为了切start_origin的sdk域
				/** 账户存储标识 startOrigin 使用说明
				 * 高瑞发: grf, 广州：gf, 深圳：sz
				 */
				this.getStorageUserInfo({ gid, startOrigin: datas.startOrigin });
				this.getStorageGamerInfo({
					gid,
					channelId: channel,
					startOrigin: datas.startOrigin
				});
				// 加载子页面
				this.$data.comId = `Com${channel}`;
			}
		} catch (err) {
			this.updateToast(err && err.message);
		}
	}
	// lifecycles
	private created() {
		const { query, params } = this.$route;
		let { channel, imei, idfa } = query;
		imei = imei || idfa;
		channel = (channel as string) || '154';
		const startOrigin = 'grf';
		this.$data.datas = {
			...query,
			channel,
			startOrigin
		};
		const deviceImei = JSON.parse(Cookies.get('device') || '{}');
		const storageImei = (deviceImei && deviceImei.imei) || '';
		if (imei && imei !== storageImei) {
			Cookies.set('device', JSON.stringify({ imei }), { expires: expireDays });
		}
		this.getInitData();
	}
}
</script>
<style lang="scss" scoped></style>
