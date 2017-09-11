<template>
	<div id="hisWeiBo">

		<el-card class="borderCard space">
			<div slot="header"><span>His Weibo</span></div>
			<el-row  v-for="(weibo,index) in weibos">
				<weibo :weibo='weibo' v-on:showComment="showCom(index)"></weibo>
				<div class="collapseBox" :style="{'height':openHeight[index]+'px'}">
					<div ref="openBox" class="clearfix">
						<el-col :span="24">
							<div class="commentBox">
								<el-input type="textarea" placeholder="Share Something"></el-input>
								<div class="submitBox">					
									<el-button type="primary">Comment</el-button>
									<i class="iconfont icon-smile"></i>
									<i class="iconfont icon-pics"></i>
								</div>
							</div>
						</el-col>
						<el-col :span="24" class="mesBox">
							<img src="../../assets/images/weibo.png">
							<p>HR Group:</p>
							<p>CONNECT is a great way to express your idea. Your comments are essential to HKA’s growth and your identity will be protected. Send us your opinion to connect@hkairlines.com and win a HKD500 coupon!</p>
							<p>2016-08-16 17:33 <el-button type="primary" icon="edit">Reply</el-button></p>
						</el-col>
					</div>
				</div>
			</el-row>
		</el-card>		
	</div>
</template>

<script>

	import Weibo from'../../components/weibo'
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
	'time':'2213789323'}
	]
	export default {
		components: {Weibo },
		mounted(){
			for(var i=0;i<this.weibos.length;i++){
				this.openHeight.push(0)
			}
		},
		data() {
			return {
				weibos,
				openHeight:[]
			}
		},
		methods:{			
			showCom(index){
				console.log(this.openHeight[index])
				if(this.openHeight[index]==0){
					this.openHeight.splice(index,1,this.$refs.openBox[index].clientHeight);
					console.log(this.openHeight[index])
				}
				else{
					this.openHeight.splice(index,1,0);
				}				
			}
		}
	}

</script>

<style lang="scss">
	$purple: #7C5598;
	$brown: #985D55;

	#hisWeiBo{

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
				padding:0;
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
				.collapseBox{
					background:#F7F7F7;
					overflow: hidden;
					transition-duration: .45s;
					transition-property: height;
					transition-delay: 0s;
					transition-timing-function: 'ease-in-out';
					-webkit-transition-duration: .45s;
					-webkit-transition-property: height;
					-webkit-transition-delay: 0s;
					-webkit-transition-timing-function: 'ease-in-out';

				}
				.commentBox{
					box-sizing: border-box;
					padding:28px 130px 20px 20px;
					border-bottom: 2px dashed #f2f2f2;
					position: relative;
					.el-textarea{
						height: 90px;
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
						width: 96px;

						button{
							width: 100%;
							height:38px;
							font-size:16px;
							margin-bottom:10px;
							padding:10px 12px;
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
				.mesBox{
					box-sizing: border-box;
					padding:28px 20px 20px 80px;
					border-bottom: 2px dashed #f2f2f2;
					position: relative;
					&>img{
						position:absolute;
						width:50px;
						top:20px;
						left:13px;
					}
					p:nth-child(2){
						color:$purple;
						line-height:30px;
						font-size:16px;
					}
					p:nth-child(3){
						font-size:15px;
						min-height: 54px;
						padding-right: 40px;
					}
					p:last-child{
						font-size:12px;
						color:#676767;
						margin-top: 10px;
						line-height: 24px;
						button{
							float: right;
							padding: 4px 10px;
							border-radius: 2px;
							font-size: 13px;
							i{
								margin-right: 5px;
							}
						}
					}
				}
				.mesBox:last-child{
					border-bottom:none;
				}
			}

		}
	}
</style>