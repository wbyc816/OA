<template>
  <div id='forumDetail'>
    <el-card>
        <p class="header">{{details.forum.forumTitle}}</p>
        <p class="forumData"><span>楼主:{{details.forum.taskUserName}}</span><span>时间:{{details.forum.createTime}}</span><span>查看:{{details.readCount}}</span><span>回复:{{details.replyCount}}</span><span>点赞:{{details.praiseCount}}</span></p>
        <hr class="hr" >
        <el-row >
            <el-col :span="3" class="detailLeft">
              <img src="http://filetest.donghaiair.cn/pic/shuiyi/2018-04-25/00-58-11/png/Group 30974.png" alt="" class="buildingOwner">
              <img :src="details.picUrl" alt="" width="100" height="100" class="img">
              <P class="taskUserName">{{details.forum.taskUserName}}</P>
            </el-col>
            <el-col :span="21">
                <p class="ownerContent" v-html="details.forum.taskContent1"></p>
                <img v-if="details.imageList[0]" :src="details.imageList[0].nameNew" alt="" width="800" height="240" >
                <div v-if="!details.imageList[0]" class="wrap">

                </div>
                <p class="ownerData"> <span class="createTime">发表于{{details.forum.createTime}}</span>  <span class="fr"><span v-bind:class="{ praise: !details.isPraised }"><i v-if="details.isPraised" class="iconfont icon-dianzan cursor" @click="praise(details)" ></i><i v-if="!details.isPraised" class="iconfont icon-Group14 cursor" @click="praise(details)" ></i></span><span class="cursor" @click="praise(details)">点赞 ({{details.forum.forunmPraiseCount}})</span> <i class="iconfont icon-Group4 comment cursor" @click="replyOwner()"></i> <span  @click="replyOwner()" class="cursor">评论  ({{details.remarkNum}})</span></span></p>
            </el-col>
        <!-- <hr> -->
            <div v-for="(item,index) in details.floorResultBeans" >
                  <hr class="hr" >
                  <el-col :span="3" class="detailLeft">
                      <img v-if="item.forumFloor.mark1=='1'" src="http://filetest.donghaiair.cn/pic/shuiyi/2018-04-25/00-58-19/png/Group 30975.png" alt="" class="buildingOwner">
                      <!-- <div v-show="item.picUrl" v-bind:style="{ background:'url('+item.picUrl+') no-repeat center center'}" style="width:100px;height:100px"></div> -->
                      <img :src="item.picUrl" width="100" height="100" class="img" v-show="item.picUrl">
                      <img src="../../assets/images/blankHead.png" width="100" height="100" class="img" v-show="!item.picUrl">
                      <P class="taskUserName" v-bind:class="{'cr':item.forumFloor.anonymitySts}">{{item.forumFloor.taskUserName}}</P>
                      <P class="taskUserName" v-if="item.forumFloor.money!=0"><i  class="iconfont icon-Group24 moneyIcon"></i><span class="praise">{{item.forumFloor.money}}</span></P>
                  </el-col>
                  <el-col :span="21">
                      <div class="ownerContent">{{item.forumFloor.taskContent1}}</div>
                      <p class="replyContent"> <span class="createTime">发表于{{item.forumFloor.createTime}}</span> <span class="fr cursor"><span @click="comment(item,index)"><i class="iconfont icon-Group4 "></i> 评论</span>  <span v-bind:class="{ praise: !item.isPraised }" class="cursor"> <i v-if="item.isPraised" class="iconfont icon-dianzan comment " @click="praiseFloor(item)"></i><i v-if="!item.isPraised" class="iconfont icon-Group14 cursor comment" @click="praiseFloor(item)" ></i></span><span @click="praiseFloor(item)">点赞 </span> ({{item.praiseCount}})</span></p>
                      <div class="m15">
                        <el-col :span="21" v-for="reply in item.forumReplies">
                          <div  class="Dreply">
                            <p >
                              <el-row :gutter="50">
                                <el-col :span="1">
                                  <img :src="reply.taskUserPic" alt="" width="36" height="36"  class="br20" v-show="reply.taskUserPic"> 
                                  <img src="../../assets/images/blankHead.png" width="36" height="36" class="br20" v-show="!reply.taskUserPic">
                                  <!-- <div v-show="reply.taskUserPic" v-bind:style="{ background:'url('+reply.taskUserPic+') no-repeat center center'}" class="br20"  style="width:36px;height:36px"></div> -->

                                </el-col>
                                <el-col :span="22">
                                  <div class="mt8">
                                    <span class="nameColor" >{{reply.taskUserName}}：</span><span v-if="reply.lastUserName" >回复<span class="nameColor">{{reply.lastUserName}}：</span></span>
                                   {{reply.taskContent1}}
                                  </div>
                                  
                                </el-col>
                              </el-row>
                              
                            </p>

                            <p class="fr mtb10"><span class="createTime">{{reply.createTime}}</span><span @click="isReply(reply,index)" class="cursor"> 回复</span></p>
                            <hr class="hr hrce5">
                          </div>
  
                        </el-col>
                        <el-col :span="21">
                          <div  class="DreplyTextarea">
                            <div>
                              <el-row >
                                <el-col :span="3" class="detailLeft replyLeft">
                                  回复 <span  class="nameColor">{{Dparam.taskUserName}}：</span>
                                </el-col>
                                <el-col :span="20" class="detailLeft">
                                  <el-input :ref="Dparam.id" v-model="content" :rows="1" resize="none" type="textarea" :maxlength="500" placeholder="最多输入500字符"  class="content DreplyTextareaInput"></el-input>
                                </el-col>
                              </el-row>
                              <input class="hiddenDreplyTextarea" type="text" >
                              </div>
                                <p class="cr DnickTip">(匿名评论后名字为红色)</p>
                                <el-checkbox v-model="DreplyTextareaNickNamecheckbox" class="replyTextareaNickNamecheckbox">启用匿名</el-checkbox>
                                <el-input class="replyTextareaNickName" v-model="DreplyTextareaNickName"></el-input>
                                <el-button  @click="replyContent(Dparam,index)" class="commonBtn">评论</el-button>
                                <el-button  @click="cancelReplyContent(index)" class="cancelBtn">取消</el-button>
                          </div>
                        
                        </el-col>
                        
                        <el-col :span="21">
                          <div  class="replyTextarea">
                            <div>
                              <el-row :gutter="60">
                                <el-col :span="1" class="detailLeft">
                                  <img :src="userInfo.picUrl"  width="36" height="36"  class="imgLeft" v-show="userInfo.picUrl!='http://filetest.donghaiair.cnnull'">
                                  <!-- <div v-show="userInfo.picUrl!='http://filetest.donghaiair.cnnull'" class="imgLeft" v-bind:style="{ background:'url('+userInfo.picUrl+') no-repeat center center'}"  style="width:36px;height:36px"></div> -->
                                  <img src="../../assets/images/blankHead.png" width="36" height="36" class="br20 m151010"  v-show="userInfo.picUrl=='http://filetest.donghaiair.cnnull'">
                                </el-col>
                                <el-col :span="22" class="detailLeft">
                                  <el-input :ref="param.forumFloor.id"  :rows="1" resize="none" type="textarea" :maxlength="500" placeholder="最多输入500字符" class="replyTextareaInput content" v-model="content"></el-input>
                                </el-col>
                              </el-row>
                              <input class="hiddenreplyTextarea" type="text">
                                </div>
                                <p class="cr DnickTip">(匿名评论后名字为红色)</p>
                                <el-checkbox v-model="replyTextareaNickNamecheckbox" class="replyTextareaNickNamecheckbox">启用匿名</el-checkbox>
                                <el-input class="replyTextareaNickName" v-model="replyTextareaNickName"></el-input>
                                <el-button  @click="floorContent(param,index)" class="commonBtn">评论</el-button>
                                <el-button  @click="cancelFloorContent(index)" class="cancelBtn">取消</el-button>
                          </div>
                        </el-col>
                      </div>  
                    </el-col>
                    </div>
        </el-row>
        
         <div  class="replyFloorTextarea">
            <p class="publishedComment">发表评论</p>
            <div>
              <el-row >
                <el-col :span="3" class="detailLeft">
                  <img :src="Fparam.picUrl"  width="100" height="100" class="br100" v-show="Fparam.picUrl!='http://filetest.donghaiair.cnnull'">
                  <img src="../../assets/images/blankHead.png" width="100" height="100" class="br100"  v-show="Fparam.picUrl=='http://filetest.donghaiair.cnnull'">
                </el-col>
                <el-col :span="21" class="detailLeft">
                  <el-input class="replyFloorTextareaInput" resize="none" type="textarea" :maxlength="500" placeholder="最多输入500字符" v-model="replyForumFloorContent"></el-input>
                  <input ref="replyFloorTextareaInput" type="text" class="hiddenReplyOwenr">
                </el-col>
              </el-row>
                </div>

                <el-checkbox v-model="useNickName" class="useNickName">启用匿名</el-checkbox>
                <el-input class="nickName" v-model="nickName"></el-input>

                <el-button  @click="replyForumFloor(details)" class="publishBtn">评论</el-button>
                <!-- <el-button  @click="cancelReplyForumFloor" class="cancelBtn">取消</el-button> -->
          </div>
          <p class="cr nickTip">(匿名评论后名字为红色)</p>
          <div class="pageBox clearfix centerPage" v-show="totalSize>0">
            <el-pagination @current-change="handleCurrentChange" :current-page="searchParams.pageNumber" :page-size="searchParams.pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
    </el-card>

    <el-dialog :visible.sync="DialogUploadAavatar" size="small" class="myDialog"  custom-class="archiveDialog">
      <span slot="title">上传头像</span>
      <el-form  :model="forumUpload"  ref="forumUpload">
          <el-form-item label=""  class="uploadBox" :rules="[{ required: false, message: '头像未上传'}]" prop="avatar">
            <el-upload ref="uploadAavatar" class="avatar-uploader" :auto-upload="false" :action="baseURL+'/emp/updatePic'" :data="{id:userInfo.empId}" :show-file-list="false"  :on-change="handleChangeAvatar">
              <img v-if="forumUpload.avatar" :src="forumUpload.avatar"  @error="forumUpload.avatar=blankHead" width="200" style="margin:0 auto" class="avatar">
              <img v-else src="http://filetest.donghaiair.cn/backstage/illustrate/icon.png" alt="">
            </el-upload>
          </el-form-item>
      </el-form>
      <p class="tac">上传头像得奖几率更大哦</p>
      <div class="buttonBox">
        
        <el-button size="large" type="primary" @click="upBtn">上传</el-button>
        <el-button size="large" type="primary" @click="upAvatar">确定</el-button>
        <!-- <el-button size="large" type="primary" @click="cancelUpAvatar">取消上传</el-button> -->
      </div>
    </el-dialog>

   
   <back-button></back-button>
  </div>
</template>
<script>
// import VueUEditor from 'vue-ueditor'
// import { mapGetters } from 'vuex'
import { mapGetters, mapMutations } from 'vuex'
import BackButton from '../../components/backButtonAll.component.vue'

export default {
  name:'forumDetail',
  data() {
    return {
      DreplyTextareaNickNamecheckbox:"",
      DreplyTextareaNickName:"",
      replyTextareaNickName:"",
      replyTextareaNickNamecheckbox:"",
      nickName:"",
      useNickName:"",
      //回复的回复
      Dparam:{

      },
      //楼主
      Fparam:{

      },
      //登陆人
      param:{
        forumFloor:{
          id:"",
        }
      },
      // fileForm:{

      // },
      content:"",
      replyForumFloorContent:"",
       searchParams: {
        "pageSize": 10,
        "pageNumber": 1,
      },
      DialogUploadAavatar:false,
      totalSize:0,
      isClickReply:false,
      DreplyTextarea:"回复",
      details: {
          isPraised:0,
          
          forum:{
              forumTitle:"",
              taskUserName:"",
              createTime:"",
              remarkNum:"",
          }
          ,
          imageList:[{nameNew:""}],
       
      },
      forumUpload:{
        avatar:"",
      }
    };
  },
  components:{
    // VueUEditor
    BackButton
  },
  created() {
    this.getDetail();
    this.defaultValue();
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'baseURL',
    ])
  },
  mounted() {
  },
  methods: {
    defaultValue(){
      this.nickName="游客"+this.userInfo.empId.substr(0,4);
      this.DreplyTextareaNickName="游客"+this.userInfo.empId.substr(0,4);
      this.replyTextareaNickName="游客"+this.userInfo.empId.substr(0,4);
    },
    upBtn(){
      document.getElementsByName("file")[0].click();
    },
    upAvatar(){
      // console.log(this.$refs.uploadAavatar)
      this.$refs.uploadAavatar.submit();
      this.DialogUploadAavatar=false;
       setTimeout(() => {
            this.getDetail();
        }, 1000)
     
      
      // window.location.reload();
      // this.searchParams.pageNumber=a;
      // window.onbeforeunload=function(){

      // 　　console.log(666)
      // 　　console.log(this.searchParams.pageNumber)

      // }
    },
    cancelUpAvatar(){
      this.DialogUploadAavatar=false;
    },
    handleChangeAvatar(file, fileList) {
      var res=/[\s{}#]/g;
      if(res.test(file.name)){
          this.$message.error('上传图片名字中不能包含空格，{，}，#!');
      }else{
        const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 <2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        if (isJPG && isLt2M) {
          this.avatarChangeStatus = true;
          this.forumUpload.avatar = file.url;
        }
      }
    },
    cancelReplyContent(index){
      document.getElementsByClassName("DreplyTextarea")[index].style.display="none";
    },
    cancelFloorContent(index){
      document.getElementsByClassName("replyTextarea")[index].style.display="none";
    },
    cancelReplyForumFloor(){
      // document.getElementsByClassName("replyFloorTextarea")[0].style.display="none";
    },
    handleCurrentChange(page) {
      this.searchParams.pageNumber = page;
      this.getDetail();
      this.replyForumFloorContent="";
    },
    //回复楼
    comment(item,index){
      this.$http.post("/forum/validateForumPic", {
         empId:this.userInfo.empId
      }).then(res => {
      if (res.status == 0) {
       
      } else {
        this.DialogUploadAavatar=true;
      }
      }, res => {

      })
      this.param=item;  
      for(var i=0;i<document.getElementsByClassName("DreplyTextarea").length;i++){
        document.getElementsByClassName("DreplyTextarea")[i].style.display="none";
      }
      for(var i=0;i<document.getElementsByClassName("replyTextarea").length;i++){
        document.getElementsByClassName("replyTextarea")[i].style.display="none";
      }
       document.getElementsByClassName("replyTextarea")[index].style.display="block";
    },
    replyOwner(){
      this.$refs.replyFloorTextareaInput.focus()
       this.$http.post("/forum/validateForumPic", {
         empId:this.userInfo.empId
      }).then(res => {
        if (res.status == 0) {
      this.Fparam=this.userInfo;
      
      // document.getElementsByClassName("replyFloorTextarea")[0].style.display="block";
     
      // document.getElementsByClassName("replyFloorTextareaInput")[0].focus();
      // document.getElementsByClassName("replyFloorTextareaInput")[0].focus();

      // document.documentElement.scrollTop=document.body.clientHeight*10;
      // document.body.scrollTop=document.body.clientHeight;
         } else {
          this.DialogUploadAavatar=true;
        }
      }, res => {

      })
      for(var i=0;i<document.getElementsByClassName("replyTextarea").length;i++){
        document.getElementsByClassName("replyTextarea")[i].style.display="none";
      }
      for(var i=0;i<document.getElementsByClassName("DreplyTextarea").length;i++){
        document.getElementsByClassName("DreplyTextarea")[i].style.display="none";
      }
     
    },
    praise(details){
      var that=this;
      this.$http.post('/forum/forumPraise', { 
        forumTitle:details.forum.forumTitle,
        forunId: this.$route.params.id ,
        "forumType1": details.forum.forumType1,
        "prauseUserId": this.userInfo.empId,
        "prauseUserName": this.userInfo.name,
        "prauseDeptId": this.userInfo.deptId,
        "prauseDeptName": this.userInfo.deptName,
        "prauseDeptMajorId":this.userInfo.deptParentId,
        "prauseDeptMajorName": this.userInfo.deptParentName,
        "toPrauseUserId": details.forum.taskUserId,
        "toPrauseUserName": details.forum.taskUserName,
        "type": 1,
        "isCancel": details.isPraised==0?0:1
      },{ body: true })
        .then(res => {
          if (res.status == 0) {
            details.isPraised=!details.isPraised;
            console.log(555)
            that.getDetail();
           } else {
            
          }
        })
    },
    praiseFloor(item){
      this.$http.post('/forum/forumPraise', { 
        forumTitle:item.forumFloor.forumTitle,
        forunId: this.$route.params.id ,
        "floorId": item.forumFloor.id,
        "forumType1": item.forumFloor.forumType1,
        "prauseUserId": this.userInfo.empId,
        "prauseUserName": this.userInfo.name,
        "prauseDeptId": this.userInfo.deptId,
        "prauseDeptName": this.userInfo.deptName,
        "prauseDeptMajorId":this.userInfo.deptParentId,
        "prauseDeptMajorName": this.userInfo.deptParentName,
        "toPrauseUserId": item.forumFloor.taskUserId,
        "toPrauseUserName": item.forumFloor.taskUserName,
        "type": 2,
        "isCancel": item.isPraised==0?0:1
      
      },{ body: true })
        .then(res => {
          if (res.status == 0) {
            item.isPraised=!item.isPraised;
            this.getDetail()
          } else {

          }
        })
    },
    //回复帖子
    replyForumFloor(details){
       this.$refs.replyFloorTextareaInput.focus()
       this.$http.post("/forum/validateForumPic", {
         empId:this.userInfo.empId
      }).then(res => {
        if (res.status == 0) {
        
        }else{
        this.DialogUploadAavatar=true;
      }
      })
      var param={
        "forumFloor": {
        "forumTitle":details.forum.forumTitle,
        "forumId": details.forum.id,//*帖子id
        "forumType1":details.forum.forumType1,
        "taskUserId": this.userInfo.empId,
        "taskUserName": this.userInfo.name,
        "taskDeptId": this.userInfo.deptId,
        "taskDeptName": this.userInfo.deptName,
        "taskDeptMajorId":this.userInfo.deptParentId,
        "taskDeptMajorName": this.userInfo.deptParentName,
        "taskContent1": this.replyForumFloorContent,
        "anonymitySts": 0,
        },
      "operation": "1"
      }
        if(this.useNickName&&this.nickName){
          param.forumFloor.anonymitySts=1;
          param.forumFloor.nickName=this.nickName;
        }
      if(this.replyForumFloorContent){
        this.$http.post('/forum/addForumInfo',  
        param
    ,{ body: true })
        .then(res => {
          if (res.status == 0) {
            this.getDetail("lastPage");
            this.replyForumFloorContent="";
            this.useNickName="";
            this.nickName="";
            this.defaultValue();
            // document.getElementsByClassName("replyFloorTextarea")[0].style.display="none";
            this.$message.success('评论成功');
          } else {
            this.$message.error('评论失败');
          }
        })
      }else{
        this.$message.warning('请输入评论内容');
      }
      
    },
    isReply(reply,index){
      

      this.$http.post("/forum/validateForumPic", {
         empId:this.userInfo.empId
      }).then(res => {
        if (res.status == 0) {
       
        } else {
          this.DialogUploadAavatar=true;
        }
      }, res => {

      })
         this.Dparam=reply;
          for(var i=0;i<document.getElementsByClassName("replyTextarea").length;i++){
            document.getElementsByClassName("replyTextarea")[i].style.display="none";
          }
          for(var i=0;i<document.getElementsByClassName("DreplyTextarea").length;i++){
            document.getElementsByClassName("DreplyTextarea")[i].style.display="none";
          }
          // document.getElementsByClassName("replyFloorTextarea")[0].style.display="none";
          document.getElementsByClassName("DreplyTextarea")[index].style.display="block";
          document.getElementsByClassName("hiddenDreplyTextarea")[index].focus()
          this.DialogUploadAavatar=false;
     
      
    },
    //回复的回复
    replyContent(id,index){
       
      var contentId=id.id;
      var param={
        "forumReply": {
        "forumTitle":id.forumTitle,
        "forumId": id.forumId,//*帖子id
        "forumType1":id.forumType1,
        "taskUserId": this.userInfo.empId,
        "taskUserName": this.userInfo.name,
        "taskDeptId": this.userInfo.deptId,
        "taskDeptName": this.userInfo.deptName,
        "taskDeptMajorId":this.userInfo.deptParentId,
        "taskDeptMajorName": this.userInfo.deptParentName,
        "taskContent1":this.$refs[contentId][0].currentValue,
        "lastReplyId": this.Dparam.id,//上一条   "id": "",//修改传 回复id
        lastUserId:id.taskUserName,
        lastUserName:id.taskUserId,
        "anonymitySts": 0,
        "floorId": this.Dparam.floorId//楼层id
      },
       "operation": "1"
      }
      if(this.DreplyTextareaNickName&&this.DreplyTextareaNickNamecheckbox){
        param.forumReply.anonymitySts=1;
        param.forumReply.nickName=this.DreplyTextareaNickName;
      }
      if(this.$refs[contentId][0].currentValue){
        this.$http.post('/forum/addForumInfo', param,{ body: true })
        .then(res => {
          if (res.status == 0) {
            this.content="";
            this.getDetail();
            document.getElementsByClassName("DreplyTextarea")[index].style.display="none";
            // document.getElementsByClassName("replyFloorTextarea")[0].style.display="display";
            this.DreplyTextareaNickNamecheckbox="";
            this.DreplyTextareaNickName="";
            this.defaultValue();
            this.$message.success('回复成功');
          } else {
            this.$message.error('回复失败');
          }
        })
      }else{
        this.$message.warning('请输入回复内容');
      } 
      
    },
    //回复楼层
    floorContent(id,index){  
      
      var contentId=id.forumFloor.id;
      // console.log(id)
      // console.log(contentId)
      // console.log(this.$refs[contentId])
      var param={
        "forumReply": {
          "forumTitle":id.forumFloor.forumTitle,
          "forumId": id.forumFloor.forumId,//*帖子id
          "forumType1":id.forumFloor.forumType1,
          "taskUserId": this.userInfo.empId,
          "taskUserName": this.userInfo.name,
          "taskDeptId": this.userInfo.deptId,
          "taskDeptName": this.userInfo.deptName,
          "taskDeptMajorId":this.userInfo.deptParentId,
          "taskDeptMajorName": this.userInfo.deptParentName,
          "taskContent1":this.$refs[contentId][0].currentValue,
          "lastReplyId": this.Dparam.id,//上一条   "id": "",//修改传 回复id
          "anonymitySts": 0,
          "floorId": id.forumFloor.id//楼层id
      },
       "operation": "1"
      }
      if(this.replyTextareaNickNamecheckbox&&this.replyTextareaNickName){
        param.forumReply.anonymitySts=1;
        param.forumReply.nickName=this.replyTextareaNickName;
      }
      if(contentId){
         this.$http.post('/forum/addForumInfo', param,{ body: true })
        .then(res => {
          if (res.status == 0) {
            this.content="";
            this.getDetail();
            document.getElementsByClassName("replyTextarea")[index].style.display="none";
            document.getElementsByClassName("replyFloorTextarea")[0].style.display="display";
            this.replyTextareaNickName="";
            this.replyTextareaNickNamecheckbox="";
            this.defaultValue();
            this.$message.success('评论成功');
          } else {
            this.$message.error('评论失败');
          }
        })
      }else{
         this.$message.warning('请输入评论内容');
      }
 
      
     
    },
    getDetail(lastPage) {
      
       this.$http.post("/emp/getEmpInfoById", {
         id:this.userInfo.empId
      }).then(res => {
        if (res.status == 0) {
          this.Fparam=res.data;
        }else
        {}
      })
      if(lastPage){
        this.searchParams.pageNumber=Math.ceil((this.totalSize+1)/10)
      }
      
      this.$http.post('/forum/selectForumDetail', { pageNumber:this.searchParams.pageNumber,pageSize:10,forumId: this.$route.params.id ,empId:this.userInfo.empId})
        .then(res => {
          if (res.status == 0) {
            this.details = res.data;
            this.totalSize= res.data.total;
          } else {

          }
        })
    },
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#forumDetail {
  .tac{
    text-align:center
  }
  .nickTip{
    position:relative;
    left:650px;
    top:-13px;
  }
  .DnickTip{
    position:relative;
    left:300px;
    top:-23px;
  }
  .cr{
    color:red;
  }
  .nickName,.replyTextareaNickName{
    width: 100px;
    background: #07a9e9;
    line-height: 10px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    border: 1px solid #07a9e9;
    position: absolute;
    bottom:30px;
    right:120px;
    border-radius: 4px;
    z-index:1;
  }
  .replyTextareaNickName{
    bottom:20px;
    right:180px;
  }
  .replyTextareaNickName .el-input__inner{
    height:20px
  }
  .useNickName,.replyTextareaNickNamecheckbox{
    width: 100px;
    line-height: 10px;
    text-align: center;
    font-size: 14px;
    position: absolute;
    bottom:-10px;
    right:230px;
    border-radius: 4px;
  }
  .nickName .el-input__inner{
    height:20px
  }
  .nickName{
    bottom:-10px;
  }
  .replyTextareaNickNamecheckbox{
    bottom:20px;
    right:290px;
  }
  .el-upload {
    display:block
  }
  .el-dialog--small{
    width:300px;
  }
  .moneyIcon{
    color:#FFD702
  }
  .wrap{
    height: 100px
  }
  .br100{
    border-radius:100px;
  }
  .br20{
    border-radius:20px;
  }
  .m151010{
    margin:15px 0 10px 10px
  }
  .replyFloorTextarea{
    position:relative;
    border-top:1px solid #e5e5e5;
    padding-top:20px;
  }
  .imgLeft{
    border-radius:20px;
    margin:15px 0 10px 10px;
  }
  .hiddenDreplyTextarea,.hiddenreplyTextarea,.hiddenReplyOwenr{
    opacity:0
  }
  .replyLeft{
    margin-left:20px;
    padding:15px 0 0 0px;
  }
  .DreplyTextarea,.replyTextarea{
    display:none;
    position:relative;
  }
  .mt{
    margin-top:8px
  }
  .br20{
    border-radius:20px;
  }
  .m15{
    margin:15px
  }
  .publishedComment{
    font-size: 20px;
    margin-bottom: 20px;
  }
  .uploadBox{
    padding: 10px;
  }
  .buttonBox{
    padding: 10px 20px;
    text-align: center;
    button {
      border-radius: 3px;
      font-size: 14px;
    }
  }
  .cursor{
    cursor:pointer
  }
  .cancelBtn{
    width: 60px;
    height: 30px;
    background: #07a9e9;
    line-height: 10px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    border: 1px solid #07a9e9;
    position: absolute;
    bottom:10px;
    right:100px;
    border-radius: 4px;
  }
  .content{
    padding: 15px
  }
  .commonBtn{
    width: 60px;
    height: 30px;
    background: #07a9e9;
    line-height: 10px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    border: 1px solid #07a9e9;
    position: absolute;
    bottom:10px;
    right:30px;
    border-radius: 4px;
  }
  .publishBtn{
    z-index:10;
    width: 60px;
    height: 30px;
    background: #07a9e9;
    line-height: 10px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    border: 1px solid #07a9e9;
    position: absolute;
    bottom:-20px;
    right:30px;
    border-radius: 4px;
  }
  .centerPage{
    text-align: center;
  }
  font-size: 16px;
  .DreplyTextarea,.replyTextarea{
    margin: 10px 0;
    border:1px solid #EEE;
    min-height: 120px;
    
  }
  .mtb10{
    margin: 10px 0;
  }
  .fr{
      float: right ;
    }
    
    & .createTime{
      color:#95989A;
      font-size: 12px;
    }
  .nameColor{
    color:#0460AE;
  }
  .Dreply{
    // border:1px solid red;
    background: #f9faff;
    // margin: 15px 15px 0;
    padding: 10px
  }
  .replyContent{
    margin-top: 100px;
    font-size: 12px;
    & .createTime{
      color:#95989A;
    }
    & .fr{
      float: right ;
    }
  }
  .comment{
    margin-left:20px; 
  }
  .ownerData{
    font-size: 12px;
    margin: 15px  0;
    & .fr{
      float: right ;
    }
    & .createTime{
      color:#95989A;
    }
  }
  .taskUserName{
    // text-align: center
    margin:10px 0 0 25px;
    font-size: 16px;
  }
  .hr{
    background-color: #e5e5e5;
    border:none;
    height: 1px;
    clear: both;
  }
  .hrce5{
    background-color: #e5e5e5;
  }
  .forumData{
    color:#95989A;
    font-size: 12px;
    text-align: center;
    margin:10px 0;
    span{
      margin: 10px;
    }
  }
  .header{
    text-align: center;
    font-size: 20px;
  }
    .praise{
      color:#ff9300;
    }
    .img{
        border-radius: 50px;
        margin-top: 20px;
        // border:1px solid red;
    }
    .detailLeft{
      position: relative;
    }
    .buildingOwner{
      position: absolute;
      right:-6px;
      top: -21px;
    }
    .ownerContent{
      margin: 15px 0 20px 0;
      font-size: 16px
    }

//   .borderCard {
//     padding-bottom: 0;
//     min-height:500px;
//     .el-card__header{
//       padding:12px;
//     }
//     .el-card__body{
//       padding-bottom:10px;
//     }
//   }
//   .el-col {
//     position: relative;
//     font-size: 15px;
//     border-bottom: 1px solid #F2F2F2;
//     padding: 15px 15px 15px 190px;
//     min-height: 51px;
//     .title {
//       position: absolute;
//       color: $main;
//       left: 30px;
//       top: 15px;
//     }
//   }
}

</style>
 