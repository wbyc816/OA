<template>
  <div  id="mail">
    <el-row :gutter='12'>
      <el-col :span='17'>
        <el-row >
          <el-col :span='24'>
            <div v-show="isPresident!=1">
            <el-card class="mailbox" style="height:457px;" v-show="new_mail==1">
              <div slot="header" class="clearfix">
                <span style="line-height: 36px;">发送新邮件</span>
              </div>

              <el-form ref="baseForm" :model="baseForm" label-width="80px" style="margin-top:50px;">
                  <el-form-item label="标题">
                    <el-input v-model="baseForm.emailTitle" style="width:600px;margin-left:50px;" ></el-input>
                  </el-form-item>
                  <el-form-item label="内容">
                      <el-input type="textarea" v-model="baseForm.emailContent" resize="none" style="width:600px;margin-left:50px"></el-input>
                  </el-form-item>
                  <el-form-item style="margin-left:50px">
                    <el-button type="primary" @click="onSubmit" style="width:150px;height:47px">提交</el-button>
                  </el-form-item>
                </el-form>
            </el-card>

            <el-card class="mailbox" style="height:630px;position:relative;" v-show="mail_list==1">
              <div slot="header" class="clearfix">
                <span style="line-height: 36px;">邮件列表</span>
              </div>

              <el-table
              :data="MailDatas"
              stripe
              style="width: 100%" @row-click="clickRowOther">
              <el-table-column
                prop="emailTitle"
                label="标题"
                >
                <template scope="scope">
                   <div @click="mail_content_detail(scope.row.id)" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;height:20px;width:150px;cursor:pointer">{{ scope.row.emailTitle}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="postTime"
                label="发送时间"
                >
                <template scope="scope">
                  <span style="cursor:pointer">{{ scope.row.postTime | time("all") }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="replyTime"
                label="回复时间"
                >
                <template scope="scope">
                  <span  style="cursor:pointer">{{ scope.row.replyTime | time("all") }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="isReply"
                label="状态"
                width="100"
                >
                <template scope="scope">
                  <span  style="cursor:pointer">{{scope.row.isReply=="0"?"未回复":"已回复"}}</span>
                </template>
              </el-table-column>
            </el-table>
             <div class="pageBox" v-show="true" >
                <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager,  next, jumper" :total="totalSize">
                </el-pagination>
              </div>
            </el-card>

             <el-card class="mailbox" style="height:457px;" v-show="mail_detail==1">
                <div slot="header" class="clearfix">
                  <span style="line-height: 36px;">邮件详情</span>
                </div>
                <div style="padding: 18px ;font-size:16px">
                  <div style="min-height:150px"  v-show="isReply==1">
                    <div style="width:600px;display:inline-block" >回复人：{{detailDatas.replyName}}</div>   时间：{{detailDatas.replyTime | time("all")}}
                    <hr style="border:1px dashed #D5DADF">
                    {{detailDatas.replyContent}}
                  </div>
                  <div style="min-height:150px">
                    <div style="width:600px;display:inline-block" >发件人：{{detailDatas.postName}}|{{detailDatas.postDept}}</div>    时间：{{detailDatas.postTime | time("all")}}
                    <hr style="border:1px dashed #D5DADF">
                    <div style="font-weight:bold;margin-bottom:20px">标题：{{detailDatas.emailTitle}}</div>
                    {{detailDatas.emailContent}}
                  </div>
                </div>
            </el-card>
        </div>

         <div v-show="isPresident==1">

            <el-card class="mailbox" style="height:630px;position:relative;" v-show="boss_mail_list==1">
              <div slot="header" class="clearfix">
                <span style="line-height: 36px;">邮件列表</span>
              </div>

              <el-table
              :data="MailDatas"
              stripe
              style="width: 100%" @row-click="clickRow">
              <el-table-column
                prop="emailTitle"
                label="标题"
                >
                <template scope="scope">
                  <div style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;height:20px;width:150px;">{{ scope.row.emailTitle}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="postTime"
                label="发送时间"
                >
                <template scope="scope">
                  <span style="" >{{ scope.row.postTime | time("all")}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="postName"
                label="发送人"
                >
                <template scope="scope">
                  <span style="" >{{ scope.row.postName }} | {{scope.row.postDept}}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="isReply"
                label="状态"
                width="100"
                >
                <template scope="scope">
                  <span style="" >{{scope.row.isReply=="0"?"未回复":"已回复"}}</span>
                </template>
              </el-table-column>
            </el-table>
             <div class="pageBox" v-show="true" >
                <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager,  next, jumper" :total="totalSize">
                </el-pagination>
              </div>
            </el-card>

             <el-card class="mailbox" style="height:457px;" v-show="boss_mail_detail==1">
               <div v-show="bossReply==0">
                <div slot="header" class="clearfix">
                  <span style="line-height: 36px;">邮件详情</span>
                </div>
                <div style="padding: 18px ;" >
     
                  <div style="min-height:150px">
                    <div style="width:600px;display:inline-block" >发件人：{{detailDatas.postName}} | {{detailDatas.postDept}}</div>    时间：{{detailDatas.postTime | time("all")}}
                    <hr style="border:1px dashed #D5DADF">
                    <div style="font-weight:bold;margin-bottom:20px">标题：{{detailDatas.emailTitle}}</div>
                    {{detailDatas.emailContent}}
                  </div>
                  <div>
                    <hr>
                     
                      <el-form ref="baseForm" :model="bossForm" label-width="80px" style="margin-top:10px;">
                        <el-form-item label="回复内容">
                            <el-input type="textarea" v-model="bossForm.bossEmailContent" resize="none" style="width:600px;margin-left:50px"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-left:50px">
                          <el-button type="primary" @click="bossOnSubmit" style="width:150px;height:47px">提交</el-button>
                        </el-form-item>
                      </el-form>
                  </div>
                </div>
                </div>

                <div v-show="bossReply==1">
                  <el-card class="mailbox" style="height:457px;" >
                      <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">邮件详情</span>
                      </div>
                      <div style="padding: 18px ;font-size:16px">
                        <div style="min-height:150px"  v-show="isReply==1">
                          <div style="width:600px;display:inline-block" >回复人：{{detailDatas.replyName}}</div>   时间：{{detailDatas.replyTime | time("all")}}
                          <hr style="border:1px dashed #D5DADF">
                          {{detailDatas.replyContent}}
                        </div>
                        <div style="min-height:150px">
                          <div style="width:600px;display:inline-block" >发件人：{{detailDatas.postName}}|{{detailDatas.postDept}}</div>    时间：{{detailDatas.postTime | time("all")}}
                          <hr style="border:1px dashed #D5DADF">
                          <div style="font-weight:bold;margin-bottom:20px">标题：{{detailDatas.emailTitle}}</div>
                          {{detailDatas.emailContent}}
                        </div>
                      </div>
                  </el-card>
                </div>
            </el-card>
        </div>
        </el-col>

        </el-row>

      </el-col>
      <el-col :span='7' class="sideNav" >
        <el-card class="mailbox" v-show="isPresident!=1">
          <el-menu>
            <el-menu-item index="1">总裁邮箱</el-menu-item>
            <el-menu-item index="2" @click="show_new_mail">发送新邮件</el-menu-item>
            <el-menu-item index="3" @click="show_mail_list">邮件列表</el-menu-item>
          </el-menu>
        </el-card>

        <el-card class="mailbox" v-show="isPresident==1">
          <el-menu>
            <el-menu-item index="1">总裁邮箱</el-menu-item>
            <el-menu-item index="2" @click="">待回复<span style="margin-left:240px;color:#0460AE">{{emailNotReplyCount}}</span></el-menu-item>
            <el-menu-item index="3" @click="show_boss_mail_list">邮件列表</el-menu-item>
          </el-menu>
        </el-card>
       
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import SidePersonSearch from '../components/sidePersonSearch.component'

  import { mapGetters } from 'vuex'
  const tableTitle = ['员工姓名', '部门', '职位', '生日', '联系电话']
  const options = [{
    value: 'DZ',
    label: 'DZ'
  }];
  const statusValue = ['计划', '延误', '起飞', '取消', '备降', '到达'];
  export default {
    components: { SidePersonSearch },
    data() {
      return {
        new_mail:1,
        mail_list:0,
        mail_detail:0,
        boss_mail_list:1,
        boss_mail_detail:0,
        tableData:[],
        pageNumber:1,
        totalSize:0,
        MailDatas:[],
        detailDatas:{},
        isPresident:1,
        isReply:0,
        emailNotReplyCount:0,
        mailId:"",
        bossEmailContent:"",
        bossReply:0,
        baseForm: {
            EmailTitle: '',
            EmailContent: '',
          },
          bossForm:{
            bossEmailContent:"",
          }

        }
    },
    computed: {
      ...mapGetters([
        'airPortList',
        "userInfo"
      ])
  },
  created() {
      this.getMailData();
  },
  methods: {
      bossOnSubmit(){
          var params = Object.assign({ 
            "id": this.mailId,
            "emailTitle": "",
            "emailContent":"" ,
            "postEmpId": "",
            "postName": "",
            "postAddress": "",
            "postTime": "",
            "isRead": 0,
            "readTime": "",
            "replyEmpId": this.userInfo.empId,
            "replyName": "",
            "replyContent": this.bossForm.bossEmailContent,
            "replyTime": "",
            "createTime": "",
            "createUser": "",
            "updateTime": "",
            "updateUser": "",
            "sts": 0,
            "isReply": 0,
            "postDept": ""
          });
        this.$http.post("/index/replyEmail", params,{ body: true
            }).then(res => {
              setTimeout(function() {
                this.searchLoading = false;
              }, 200)
            if (res.status == 0) {
              this.MailDatas = res.basicPresidentEmailsList;
              this.totalSize = res.totalSize;
              this.isPresident = res.isPresident;
              this.emailNotReplyCount = res.emailNotReplyCount;
              this.show_boss_mail_list();
            } else {
              this.MailDatas = [];
              this.totalSize = 0;
            }
          }, res => {

          })
          },
      onSubmit() {

      var params = Object.assign({ 
        "id": "",
        "emailTitle": this.baseForm.emailTitle, 
        "emailContent":this.baseForm.emailContent,
        "postEmpId":this.userInfo.empId,
        "postName": "",
        "postAddress": "",
        "postTime": "",
        "isRead": 0,
        "readTime": "",
        "replyEmpId": "",
        "replyName": "",
        "replyContent": "",
        "replyTime": "",
        "createTime": "",
        "createUser": "",
        "updateTime": "",
        "updateUser": "",
        "sts": 0,
        "isReply": 0,
        "postDept": ""
      });
        this.$refs['baseForm'].validate((valid) => {
          if (valid) {
            this.$http.post("/index/addEmailInfo", params,{ body: true}).then(res => { 
             if (res.status == 0) {
              this.$message.success("提交成功");
              this.show_mail_list();
              this.getMailData();
            } else {
             
              this.$message.error("提交失败");
            }
          }, res => {

          })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      show_mail_list(){
        this.mail_list=1;
        this.new_mail=0;
        this.mail_detail=0;

      },
       show_new_mail(){
        this.mail_list=0;
        this.new_mail=1;
        this.mail_detail=0;
      },
      show_boss_mail_list(){
        this.boss_mail_list=1;
        this.boss_mail_detail=0;
        this.getMailData();
      },


      getMailData(){
           this.$http.post("/index/selectPresidentEmailInfo", {
              pageNumber: this.pageNumber,
              pageSize: "10",
              empId:this.userInfo.empId,
              //empId:"D3D80B656929A5BC0FA34381BF42FBDD",
            }).then(res => {
              setTimeout(function() {
                this.searchLoading = false;
              }, 200)
            if (res.status == 0) {
              this.MailDatas = res.basicPresidentEmailsList;
              this.totalSize = res.totalSize;
              this.isPresident = res.isPresident;
              this.emailNotReplyCount = res.emailNotReplyCount;

            } else {
              this.MailDatas = [];
              this.totalSize = 0;
            }
          }, res => {

          })
      },
      mail_content_detail(mail){
              this.$http.post("/index/selectEmailInfo", {
              id:mail,

            }).then(res => {
              setTimeout(function() {
                this.searchLoading = false;
              }, 200)
            if (res.status == 0) {
              this.mailId=mail;
              this.mail_list=0;
              this.new_mail=0;
              this.mail_detail=1;
              this.boss_mail_list=0;
              this.boss_mail_detail=1;
              this.detailDatas = res.data.basicPresidentEmails;
              this.isReply=res.data.basicPresidentEmails.isReply;
            } else {
              this.MailDatas = [];
              this.totalSize = 0;
            }
          }, res => {

          })
      },
      boss_mail_content_detail(mail,reply){
              this.$http.post("/index/selectEmailInfo", {
              id:mail,

            }).then(res => {
              setTimeout(function() {
                this.searchLoading = false;
              }, 200)
            if (res.status == 0) {
              this.bossReply=reply;
              this.mailId=mail;
              this.mail_list=0;
              this.new_mail=0;
              this.mail_detail=1;
              this.boss_mail_list=0;
              this.boss_mail_detail=1;
              this.detailDatas = res.data.basicPresidentEmails;
              this.isReply=res.data.basicPresidentEmails.isReply;
            } else {
              this.MailDatas = [];
              this.totalSize = 0;
            }
          }, res => {

          })
      },


     click_highSearch() {
      this.ishighSearch=1;
     },
     close_highSearch() {
      this.ishighSearch=0;
     },
     search_type(fileType){
        this.fileCode=fileType.dictCode;
     },
     click_Search() {
         this.$http.post("/doc/selectFileList", {
              pageNumber: this.pageNumber,
              docTitle:this.file_title,
              classify1:this.fileCode,
              pageSize: "10",
              empId:this.userInfo.empId,
            }).then(res => {
              setTimeout(function() {
                this.searchLoading = false;
              }, 200)
            if (res.status == 0) {
              this.fileDatas = res.data.selectDocInfoVolist;
              this.totalSize = res.data.totalSize;
            } else {
              this.tableData = [];
              this.totalSize = 0;
            }
          }, res => {

          })
     },
     getFileData(){
          this.$http.post("/doc/selectFileList", {
            pageNumber: this.pageNumber,
            pageSize: "10",
            classify1:"ADM0401",
            empId:this.userInfo.empId,
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.fileDatas = res.data.selectDocInfoVolist;
            this.totalSize = res.data.totalSize;
          } else {
            this.tableData = [];
            this.totalSize = 0;
          }
        }, res => {

        })
      },
       fileHighSearch(){
          this.$http.post("/doc/selectFileList", {
            pageNumber: this.pageNumber,
            pageSize: "10",
            classify1:"ADM0401",
            empId:this.userInfo.empId,
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.fileDatas = res.data.selectDocInfoVolist;
            this.totalSize = res.data.totalSize;
          } else {
            this.tableData = [];
            this.totalSize = 0;
          }
        }, res => {

        })
      },
       getFileType(){
          this.$http.post("/api/getDict", {
            dictCode:"ADM04",
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.fileTypes = res.data;
          } else {
            this.tableData = [];
            this.totalSize = 0;
          }
        }, res => {

        })
      },


 
   
    handleCurrentChange(page) {
      this.pageNumber = page;
      this.getMailData()
    },
    clickRow(row, event, column){
      console.log(row);
      this.boss_mail_content_detail(row.id,row.isReply)
    },
    clickRowOther(row, event, column){
      this.mail_content_detail(row.id)
    }
  }
  }

</script>
<style lang='scss'>
  $main: #0460AE;
  $purple: #7C5598;
  #mail{
    .el-row .el-row{
    height:0px;
    background-color:transparent;
  }
  .pageBox{
    top:530px;
    right:0;
    margin: 30px 0;
    position:absolute;

  }
  .el-card__body{
    padding:0;
  }
   
  .purpleColor {
    color: $main;
  }
  .el-menu-item{
    border:1px solid #F2F2F2;
   
  }
  .el-table__row{
    cursor: pointer;
  }


     
}


  



  


</style>
