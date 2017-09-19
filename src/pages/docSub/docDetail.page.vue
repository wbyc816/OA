<template>
  <div id="docDetail">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>呈批单</span>
      </div>
      <div class='doc-section'>
      	<h4 class='doc-form_title'>公文信息</h4>
      	<el-row>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">公文号</el-col>
		  <el-col :span="6" v-if="docDetialInfo">{{docDetialInfo.doc.docNo}}</el-col>
		</el-row>
      	<el-row>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">呈报人</el-col>
		  <el-col :span="6" class="rightBorder" v-if="docDetialInfo">{{docDetialInfo.doc.taskUserName}}</el-col>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">部门</el-col>
		  <el-col :span="6" v-if="docDetialInfo">{{docDetialInfo.doc.taskDeptMajorName}}{{docDetialInfo.doc.taskDeptName}}</el-col>
		  <!-- <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">职务</el-col>
		  <el-col :span="6">{{docDetialInfo.doc.docNo}}</el-col> -->
		</el-row>
      	<el-row>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">密级程度</el-col>
		  <el-col :span="6" class="rightBorder" v-if="docDetialInfo">{{docDetialInfo.doc.docDenseType}}</el-col>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">重要程度</el-col>
		  <el-col :span="6" v-if="docDetialInfo">{{docDetialInfo.doc.docImportType}}</el-col>
		</el-row>
      	<el-row class="backV">
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">标题</el-col>
		  <el-col :span="18" v-if="docDetialInfo"><h4>{{docDetialInfo.doc.docTitle}}</h4></el-col>
		</el-row>
      	<el-row>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">请示内容</el-col>
		  <el-col :span="18" v-if="docDetialInfo">{{docDetialInfo.doc.taskContent}}
			</el-col>
		</el-row>
      	<el-row>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">附件</el-col>
		  <el-col :span="18">
		  	<a v-for="file in docDetialInfo.taskFile" :href="file.filePath">{{file.fileName}}</a>
		  </el-col>
		</el-row>
      	<el-row>
		  <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">附加公文</el-col>
		  <el-col :span="18">
		  	<a v-for="file in docDetialInfo.taskQuote" :href="file.filePath">{{file.fileName}}</a>
		  </el-col>
		</el-row>
      </div>
	    <div class='doc-section'>
	    	<h4 class='doc-form_title'>历史审批意见</h4>
	      	<el-row class="backV" v-for="(task,index) in docDetialInfo.taskDetail">
			  <el-col :span="1">&nbsp;</el-col>
			  <el-col :span="23" v-if="index>0">{{task.taskContent}}</el-col>
			  <el-col :span="24" class="timeRight" v-if="index>0">{{task.taskUserName}} {{task.startTime}}</el-col>
			  <el-col :span="23" v-if="index==0">无</el-col>
			</el-row>
	    </div>
	    <div class='doc-section'>
	    	<h4 class='doc-form_title'>我的审批意见</h4>
	    	<el-form label-position="left" label-width="128px">
		      	<el-form-item label="审批意见" class="textarea">
			        <el-col :span='18'>
			          	<el-radio-group class="myRadio" v-model="ruleForm.confidentiality">
			            	<el-radio-button label="同意">同意<i></i></el-radio-button>
			            	<el-radio-button label="拒绝">拒绝<i></i></el-radio-button>
			          </el-radio-group>
			        </el-col>
		      	</el-form-item>
		      	<el-form-item label="审批内容" class="textarea">
			        <el-col :span='18'>
			          <el-input type="textarea" v-model="ruleForm.des"></el-input>
			        </el-col>
		      	</el-form-item>
		    </el-form>
	    </div>
	</el-card>
</div>
</template>
<script>
export default{
    data(){
      return{
      	ruleForm: {
	        des: '',
	        confidentiality: '',
	    },
	    docDetialInfo:""
      }
    },
  	created() {
  		this.$http.post("/doc/getDocDetailInfo",{id:this.$route.params.id}).then(res=>{
          
          if(res.data.status==0){
            this.docDetialInfo=res.data.data
          }
        },res=>{

        })
  	}
  }
</script>
<style lang='scss'>
	#docDetail{
		.el-card__header{
			margin-bottom:10px;
		}
		.doc-section{
			.doc-form_title{
				padding-bottom: 5px;
			}
			.el-row{
				border-bottom:1px solid #D5DADF;
				.el-col{
					padding:15px 0;
					min-height: 50px;
					a{
						display: block;
						text-decoration: underline
					}
				}
			}
			h4{
				font-weight: bold;
			}
			.rightBorder{
				border-right:1px solid #D5DADF;
			}
			&+.doc-section{
				margin-top:20px;
			}
			.backV{
				background: #F7F7F7;
			}
			.timeRight{
				text-align: right;
				padding-top:0!important;
				padding-right:20px!important;
				min-height:inherit!important;
			}
		}
	}
</style>