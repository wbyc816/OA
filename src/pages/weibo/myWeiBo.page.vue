<template>
	<div id="myWeiBo">
		<el-card class="showBox">
			<div class="commentBox">
				<img src="../../assets/images/Image105.png">
				<el-input type="textarea" placeholder="Share Something"></el-input>
				<div class="submitBox">

					<el-button type="primary">Post</el-button>
					<i class="iconfont icon-smile"></i>
					<i class="iconfont icon-pics"></i>
				</div>
			</div>
		</el-card>
		<el-card>
			<span slot="header">Message Center</span>
			<el-row :gutter="10">
				<el-col :span="8" :xs='12' v-for="msg in msgs">
					<message-center :data="msg">
					</message-center>
				</el-col>
			</el-row>
		</el-card>
		<el-card class="borderCard space">
			<div slot="header"><span>All</span><span>Mutual Focos</span>
				<div class="headRight">
					<el-button type="primary" icon="plus">Create Group</el-button>
					<el-button type="primary" icon="icon-heart" v-goto="{name:'addFocus'}">Add Focus </el-button>
				</div>
			</div>
			<el-row  v-for="weibo in weibos">
				<weibo :weibo='weibo'></weibo>
			</el-row>
		</el-card>
	</div>
</template>

<script>

	import MessageCenter from'../../components/message'
	import Weibo from'../../components/weibo'
	const msgs =[
	{"type":"work","color":"#7C5598" , "text":"ActionList:21" ,"font":"icon-sousuo"},
		{"type":"message","color":"#985D55" , "text":"ActionList:31" ,"font":"icon-icon04"},
		{"type":"work","color":"#7C5598" , "text": "ActionList:41" ,"font":"icon-sousuo"},
		{"type":"work","color":"#985D55" , "text": "ActionList:51" ,"font":"icon-icon04"},
		{"type":"message","color":"#7C5598" , "text": "ActionList:61" ,"font":"icon-sousuo"}
	];
	const  weibos=[
	{'author':'HR Group',
	'text':'公司的進步實在有賴每位員工的寶貴意見，而CONNECT就是其中一個直達公司管理層的有效渠道。在跟進期間，您的身份將會被保密。 您可將意見寫信至connect@hkairlines.com。一經刊登，您將有機會獲得價值港幣500元的超市禮券。','img':'../assets/images/Image79.png',
	'forword':'1','favorite':'2','comment':'3',
	'time':'1213213233'},
	{'author':'HR Group',
	'text':'CONNECT is a great way to express your idea. Your comments are essential to HKA’s growth and your identity will be protected. Send us your opinion to connect@hkairlines.com and win a HKD500 coupon!','img':'../assets/images/Image79.pn',
	'forword':'3','favorite':'5','comment':'9',
	'time':'2213789323'},
	{'author':'HR Group',
	'text':'CONNECT is a great way to express your idea. Your comments are essential to HKA’s growth and your identity will be protected. Send us your opinion to connect@hkairlines.com and win a HKD500 coupon!','img':'../assets/images/Image79.pn',
	'forword':'3','favorite':'5','comment':'9',
	'time':'2213789323'},
	{'author':'HR Group',
	'text':'CONNECT is a great way to express your idea. Your comments are essential to HKA’s growth and your identity will be protected. Send us your opinion to connect@hkairlines.com and win a HKD500 coupon!','img':'../assets/images/Image79.pn',
	'forword':'3','favorite':'5','comment':'9',
	'time':'2213789323'},
	{'author':'HR Group',
	'text':'CONNECT is a great way to express your idea. Your comments are essential to HKA’s growth and your identity will be protected. Send us your opinion to connect@hkairlines.com and win a HKD500 coupon!','img':'../assets/images/Image79.pn',
	'forword':'3','favorite':'5','comment':'9',
	'time':'2213789323'},
	];
	export default {
		components: { MessageCenter,Weibo },
		data() {
			return {
				msgs,
				weibos,
			}
		}
	}

</script>

<style lang="scss">
	$purple: #7C5598;
	$brown: #985D55;

	#myWeiBo{
		.showBox{
			padding:0;
			.commentBox{

				box-sizing: border-box;
				padding:28px 125px 20px 80px;
				position: relative;
				&>img{
					position: absolute;
					top: 10px;
					left: 5px;
					width: 67px;
				}
				.el-textarea{
					height: 102px;
					width: 100%;
					textarea{
						height: 100%;
						background: #F2F2F2;
						color:#676767;
						font-size: 15px;
						padding: 10px 15px;
						border: none;
						border-radius: 5px;
					}
				}
				.submitBox{
					position: absolute;
					top: 28px;
					right: 20px;
					width: 85px;

					button{
						width: 100%;
						border-radius:2px;
						height:38px;
						font-size:16px;
						margin-bottom:10px;
					}
					i{
						font-size: 30px;
						line-height: 38px;
						color:$purple;
					}
				}
			}
			.weibo{
				padding-top:10px;
				padding-right: 20px;
			}
		}
		.space{
			padding-bottom:0;
			.el-card__header{
				&>div>span{
					cursor: auto;
					font-size:15px;
					color:$purple;
					margin-right:20px;
				}
				.headRight{
					cursor:normal;
					position: relative;
					top: -2px;
					button{
						border-radius: 2px;
						font-size: 13px;
						padding: 5px;
					}
				}
			}
			.el-card__body{
				&>.el-row{
					border-bottom: 1px solid #f2f2f2;
				}
				.space-bottom{
					padding-top: 10px;
					.el-input-group__prepend{
						border: none;
						padding-right: 20px;
						img{
							width:47px;
							height:55px;
						}
					}
					input{
						margin-top: 6px;
						border: none;
						background: #F2F2F2;
						border-radius: 4px;
					}
					.el-input-group__append{
						border: none;
						div{
							display: inline-table;
							button{
								display:inline-block;
								font-size:16px;
								margin:0 0 0 10px;
								height:38px;
								background:$purple;
								color:#fff;
								padding:10px 25px;
							}
							i{
								font-size:30px;
								color:$purple;
								padding:0 3px;
								vertical-align: middle;
								display: table-cell;
							}

						}
					}
				}
			}

		}
	}
</style>
