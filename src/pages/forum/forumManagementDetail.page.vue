<template>
  <div id='forumManagementDetail'>
    <el-card>
        <p class="header">{{details.forum.forumTitle}}</p>
        <p class="forumData"><span>楼主:{{details.forum.taskUserName}}</span><span>时间:{{details.forum.createTime}}</span><span>查看:{{details.readCount}}</span><span>回复:{{details.replyCount}}</span></p>
        <hr class="hr" >
        <el-row >
            <el-col :span="3" class="detailLeft">
              <img src="http://filetest.donghaiair.cn/pic/shuiyi/2018-04-25/00-58-11/png/Group 30974.png" alt="" class="buildingOwner">
              <img :src="details.picUrl" alt="" width="100" height="100" class="img">
              <P class="taskUserName">{{details.forum.taskUserName}}</P>
            </el-col>
            <el-col :span="21">
                <div class="ownerContent" v-html="details.forum.taskContent1"></div>
                <img v-if="details.imageList[0]" :src="details.imageList[0].nameNew" alt="" width="800" height="240" >
                <div v-if="!details.imageList[0]" class="wrap">

                </div>
                <p class="ownerData"> <span class="createTime">发表于{{details.forum.createTime}}</span></p>
            </el-col>
        <!-- <hr> -->
            <div v-for="(item,index) in details.floorResultBeans" >
                  <hr class="hr" >
                  <el-col :span="3" class="detailLeft">
                      <img v-if="item.forumFloor.mark1=='1'" src="http://filetest.donghaiair.cn/pic/shuiyi/2018-04-25/00-58-19/png/Group 30975.png" alt="" class="buildingOwner">
                      <img :src="item.picUrl" alt="" width="100" height="100" class="img">
                      <P class="taskUserName">{{item.forumFloor.taskUserName}}</P>
                      <P class="taskUserName"  v-if="item.forumFloor.money" ><i class="iconfont icon-Group24 moneyIcon"></i><span class="praise">{{item.forumFloor.money}}</span></P>

                  </el-col>
                  <el-col :span="21">
                      <div class="ownerContent">{{item.forumFloor.taskContent1}}</div>
                      <p class="replyContent"> <span class="createTime">发表于{{item.forumFloor.createTime}}</span></p>
                      <p class="fr fourBtn"><el-button @click="deleteBtn(item)" class="commonBtn">删除</el-button><el-button @click="adoptFloor(item)" v-if="item.forumFloor.mark1!='1'" class="commonBtn">采纳</el-button> <el-button @click="cancelAdoptFloor(item)" v-if="item.forumFloor.mark1=='1'" class="cancelAdoptBtn">取消采纳</el-button>
                      <el-button class="commonBtn" @click="showTop(index)" v-if="!item.forumFloor.mark2">置顶</el-button>
                      <el-button class="cancelAdoptBtn" @click="canceltopBtn(item)" v-if="item.forumFloor.mark2">取消置顶</el-button> 
                      <el-button @click="showReward(index,item)" class="commonBtn">奖金</el-button></p>

                      <p class="clearBoth topP">
                        <el-button @click="cancelTop(index)" class="commonBtn cancelTop">取消</el-button>
                        <el-button @click="topBtn(item.forumFloor.id,index)" class="topBtn definiteTop">确定置顶</el-button>
                        <money-input v-model="sort" class="topInput" :ref="item.forumFloor.id"></money-input>
                      </p>

                      <p class="clearBoth definiteP">
                        <el-button @click="cancelReward(index)" class="commonBtn cancelReward">取消</el-button>
                        <el-button @click="rewardBtn(item.forumFloor.id,item.forumFloor.taskUserId,index,item.forumFloor.mark3)" class="topBtn definite">确定奖金</el-button>
                        <money-input v-model="money" class="rewardInput" :ref="item.forumFloor.id"></money-input>
                      </p>
                      
                         
                      
                      
                      <div>
                        <el-col :span="21" v-for="(reply,replyIndex) in item.forumReplies">
                          <div  class="Dreply">
                            <p >
                              <el-row :gutter="50">
                                <el-col :span="1">
                                  <img :src="reply.taskUserPic" alt="" width="36" height="36" class="br20">
                                </el-col>
                                <el-col :span="22">
                                  <div class="mt8">
                                    <span class="nameColor" >{{reply.taskUserName}}：</span><span v-if="reply.lastUserName">回复<span class="nameColor">{{reply.lastUserName}}：</span></span>
                                   {{reply.taskContent1}}
                                  </div>
                                </el-col>
                              </el-row>
                            </p>
                            <p class="fr mtb10"><span class="createTime">{{reply.createTime}}</span> <el-button @click="deleteFloorContent(reply)" class="commonBtn">删除</el-button></p>
                            <hr class="hr hrce5">
                          </div>
                        </el-col>
                        <el-col :span="21">
                          <div  class="DreplyTextarea">
                            <div>
                              <el-row >
                                <el-col :span="3" class="detailLeft mp" >
                                  回复 <span  class="nameColor">{{Dparam.taskUserName}}：</span>
                                </el-col>
                                <el-col :span="20" class="detailLeft">
                                  <el-input :ref="Dparam.id" v-model="content" class="content"></el-input>
                                </el-col>
                              </el-row>
                                </div>
                                <el-button  @click="replyContent(Dparam,index)" class="commonBtn">评论</el-button>
                          </div>
                        
                        </el-col>
                        
                        <el-col :span="21">
                          <div  class="replyTextarea">
                            <div>
                              <el-row :gutter="60">
                                <el-col :span="1" class="detailLeft">
                                  <img :src="userInfo.picUrl"  width="36" height="36" class="br20">
                                </el-col>
                                <el-col :span="22" class="detailLeft">
                                  <el-input :ref="param.forumFloor.id" v-model="content" class="content"></el-input>
                                </el-col>
                              </el-row>
                                </div>
                                <el-button  @click="floorContent(param,index)" class="commonBtn">评论</el-button>
                          </div>
                        </el-col>
                      </div>  
                    </el-col>
                    </div>
        </el-row>
         <div  class="replyFloorTextarea">
            <div>
              <el-row >
                <el-col :span="3" class="detailLeft">
                  <img :src="Fparam.picUrl"  width="100" height="100" class="br100">
                </el-col>
                <el-col :span="21" class="detailLeft">
                  <el-input  v-model="replyForumFloorContent"></el-input>
                </el-col>
              </el-row>
                </div>
                <el-button  @click="replyForumFloor(details)" class="commonBtn">评论</el-button>
          </div>

          <div class="pageBox clearfix centerPage" v-show="totalSize>0">
            <el-pagination @current-change="handleCurrentChange" :current-page="searchParams.pageNumber" :page-size="searchParams.pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
          </div>
    </el-card>

   
  <back-button></back-button>
  </div>
</template>
<script>
// import VueUEditor from 'vue-ueditor'
import { mapGetters } from 'vuex'
import util from '../../common/util'
import BackButton from '../../components/backButtonAll.component.vue'
import MoneyInput from '../../components/moneyInput.component'
export default {
  name:'forumDetail',
  data() {
    return {
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
      sort:"",
      money:"",
      content:"",
      replyForumFloorContent:"",
       searchParams: {
        "pageSize": 10,
        "pageNumber": 1,
      },
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
       
      }
    };
  },
  components:{
    // VueUEditor
    MoneyInput,BackButton
  },
  created() {
    this.getDetail();
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  methods: {
    cancelAdoptFloor(item){
      this.$http.post('/forum/forumAdopt', { 
      "forumId": this.$route.params.id,
      "floorId": item.forumFloor.id,
      "updateUser": this.userInfo.empId,
      "type": "",
      "floorUserId": item.forumFloor.taskUserId
    },{ body: true })
      .then(res => {
        if (res.status == 0) {
          this.$message.success('取消采纳成功');
          this.getDetail();
        } else {
          this.$message.error('取消采纳失败');
        }
      })
    },
    canceltopBtn(item){
      var that=this;
         this.$http.post('/forum/forumRecommend', {id:item.forumFloor.id,sort:"0"})
        .then(res => {
          if (res.status == 0) {
            this.$message.success('取消置顶成功');
            that.getDetail();
          } else {
            this.$message.warning('取消置顶失败')
          }
      })
    },
    
    topBtn(id,index){
      var that=this;
      document.getElementsByClassName("cancelTop")[index].style.display="none";
      document.getElementsByClassName("topInput")[index].style.display="none";
      document.getElementsByClassName("definiteTop")[index].style.display="none";
      if(this.sort){
        this.$http.post('/forum/forumRecommend', {id:id,sort:this.sort})
        .then(res => {
          if (res.status == 0) {
            this.$message.success('置顶成功');
            this.sort="";
            this.money="";
            that.getDetail();
          } else {
            this.$message.warning('置顶失败')
          }
      })
      }else{
        this.$message.warning('请输入顺序')
      }
      
    },
    deleteBtn(item){
       this.$confirm('确定删除所选发帖楼层?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(item)
        this.$http.post('/forum/addForumInfo',{
         "forumFloor": {
            "forumId": this.$route.params.id ,//*帖子id
            "id": item.forumFloor.id,//修改传 楼层id
            "forumType1":item.forumFloor.forumType1,
            "taskUserId": this.userInfo.empId,
            "taskUserName": this.userInfo.name,
            "taskDeptId": this.userInfo.deptId,
            "taskDeptName": this.userInfo.deptName,
            "taskDeptMajorId":this.userInfo.deptParentId,
            "taskDeptMajorName": this.userInfo.deptParentName,
            "taskContent1": item.forumFloor.taskContent1,
            "anonymitySts": 0,
            "updateTime":  util.formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            "updateUser": this.userInfo.name,
            "money": 0
          },
          "operation": 3
        },{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('删除成功');
              this.getDetail();
            } else {
              this.$message.warning('删除失败')
            }
          })

        console.log(55)
      }).catch(() => {

      });
    },
    deleteFloorContent(reply){
       this.$confirm('确定删除所选回复信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(reply)
        this.$http.post('/forum/addForumInfo',{
          "forumReply": {
            "forumId": reply.forumId,
            "id": reply.id,
            "forumTitle": reply.forumTitle,
            "forumType1": reply.forumType1,
            "taskUserId": this.userInfo.empId,
            "taskUserName": this.userInfo.name,
            "taskDeptId": this.userInfo.deptId,
            "taskDeptName": this.userInfo.deptName,
            "taskDeptMajorId":this.userInfo.deptParentId,
            "taskDeptMajorName": this.userInfo.deptParentName,
            // "lastReplyId": "",
            "floorId":reply.floorId,
            "lastUserId": reply.taskUserId,
            "lastUserName": reply.taskUserId,
            "lastDeptId":reply.taskDeptId,
            "lastDeptName":reply.taskDeptName,
            "lastDeptMajorId":reply.taskDeptMajorId,
            "lastDeptMajorName": reply.taskDeptMajorName,
          },
          "operation": 3
        },{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('删除成功');
              this.getDetail();
            } else {
              this.$message.warning('删除失败')
            }
          })

        console.log(55)
      }).catch(() => {

      });
    },
    rewardBtn(id,userId,index,mark3){
      if(this.money){
         this.$http.post('/forum/forumReward', { 
        "forumId": this.$route.params.id,
        "floorId": id,
        "updateUser": this.userInfo.empId,
        "money": this.money,
        "type": mark3,
        "floorUserId":userId
      },{ body: true })
        .then(res => {
          if (res.status == 0) {
            document.getElementsByClassName("rewardInput")[index].style.display="none";
            document.getElementsByClassName("definite")[index].style.display="none";
            document.getElementsByClassName("cancelReward")[index].style.display="none";
            this.sort="";
            this.money="";
            this.$message({
              message: "设置奖金成功",
              type: 'success'
            });
            this.getDetail();
          } else {
            this.$message({
              message: "设置奖金失败",
              type: 'error'
            });
          }
        })

      }else{
         this.$message({
              message: "请输入奖金",
              type: 'warning'
            });
      }
     
      
    },
    adoptFloor(item){
      this.$http.post('/forum/forumAdopt', { 
        "forumId": this.$route.params.id,
        "floorId": item.forumFloor.id,
        "updateUser": this.userInfo.empId,
        "type": "1",
        "floorUserId": item.forumFloor.taskUserId
      },{ body: true })
        .then(res => {
          if (res.status == 0) {
            this.$message.success('采纳成功');
            this.getDetail();
          } else {
            this.$message.error('采纳失败');
          }
        })
      },
    replyOwner(reply){
      console.log(reply)
       this.$http.post('/forum/addForumInfo', { 
        "forumFloor": {
        "forumId": this.$route.params.id ,//*帖子id
        "forumType1":reply.forumType1,
        "taskUserId": this.userInfo.empId,
        "taskUserName": this.userInfo.name,
        "taskDeptId": this.userInfo.deptId,
        "taskDeptName": this.userInfo.deptName,
        "taskDeptMajorId":this.userInfo.deptParentId,
        "taskDeptMajorName": this.userInfo.deptParentName,
        "taskContent1": this.$refs.replyContent.value,
        "anonymitySts": 0,

      },
       "operation": "1"
     },{ body: true })
        .then(res => {
          if (res.status == 0) {

          } else {

          }
        })
    
    },
    handleCurrentChange(page) {
      this.searchParams.pageNumber = page;
      this.getDetail()
    },
    //回复楼
    showReward(index,item){
      document.getElementsByClassName("cancelReward")[index].style.display="block";
      document.getElementsByClassName("rewardInput")[index].style.display="block";
      document.getElementsByClassName("definite")[index].style.display="block";
    
      for(var i=0;i<document.getElementsByClassName("cancelTop").length;i++){
        document.getElementsByClassName("cancelTop")[i].style.display="none";
        document.getElementsByClassName("topInput")[i].style.display="none";
        document.getElementsByClassName("definiteTop")[i].style.display="none";
      }
      this.sort="";
      this.money=item.forumFloor.money;
      
    },
    showTop(index){
      console.log(index)
      document.getElementsByClassName("cancelTop")[index].style.display="block";
      document.getElementsByClassName("topInput")[index].style.display="block";
      document.getElementsByClassName("definiteTop")[index].style.display="block";
      for(var i=0;i<document.getElementsByClassName("cancelTop").length;i++){
        document.getElementsByClassName("cancelReward")[i].style.display="none";
        document.getElementsByClassName("rewardInput")[i].style.display="none";
        document.getElementsByClassName("definite")[i].style.display="none";
      }
      this.sort="";
      this.money="";
    },
    cancelReward(index){
      document.getElementsByClassName("cancelReward")[index].style.display="none";
      document.getElementsByClassName("rewardInput")[index].style.display="none";
      document.getElementsByClassName("definite")[index].style.display="none";
    },
    cancelTop(index){
      document.getElementsByClassName("cancelTop")[index].style.display="none";
      document.getElementsByClassName("topInput")[index].style.display="none";
      document.getElementsByClassName("definiteTop")[index].style.display="none";
    },
    replyOwner(){
      this.Fparam=this.userInfo;
      document.getElementsByClassName("replyFloorTextarea")[0].style.display="block";
    },
    praise(details){
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
             details.isPraised=!details.isPraised
             console.log(details.forum.isPraised)
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
        "type": 1,
        "isCancel": item.isPraised==0?0:1
      
      },{ body: true })
        .then(res => {
          if (res.status == 0) {
            item.isPraised=!item.isPraised
          } else {

          }
        })
    },
    //回复帖子
    replyForumFloor(details){
      if(this.replyForumFloorContent){
        this.$http.post('/forum/addForumInfo', { 
        "forumFloor": {
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
     },{ body: true })
        .then(res => {
          if (res.status == 0) {
            this.getDetail();
            this.content="";
            document.getElementsByClassName("replyFloorTextarea")[0].style.display="none";
          } else {

          }
        })
      }
       
    
    },
    isReply(reply,index){
      this.isReply=true;
      this.Dparam=reply;
      document.getElementsByClassName("DreplyTextarea")[index].style.display="block";
    },
    //回复的回复
    replyContent(id,index){
      var contentId=id.id;
      console.log(this.$refs[contentId][0].currentValue)
      this.$http.post('/forum/addForumInfo', { 
        "forumReply": {
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
     },{ body: true })
        .then(res => {
          if (res.status == 0) {
            this.content="";
            this.getDetail();
            document.getElementsByClassName("DreplyTextarea")[index].style.display="none";
          } else {
          }
        })
    },
    //回复楼层
    floorContent(id,index){  
      var contentId=id.forumFloor.id;
      this.$http.post('/forum/addForumInfo', { 
        "forumReply": {
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
     },{ body: true })
        .then(res => {
          if (res.status == 0) {
            this.content="";
            this.getDetail();
            document.getElementsByClassName("replyTextarea")[index].style.display="none";
          } else {
          }
        })
    },
    getDetail() {
      this.$http.post('/forum/selectForumDetail', { pageNumber:this.searchParams.pageNumber,pageSize:10,forumId: this.$route.params.id ,empId:this.userInfo.empId})
        .then(res => {
          if (res.status == 0) {
            this.details = res.data;
            // console.log(this.details.forum.forumTitle)
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
#forumManagementDetail {
  .moneyIcon{
    color:#FFD702
  }
  .wrap{
    height: 100px
  }
  .replyFloorTextarea{
    display:none;
    position:relative;
    border-top:1px solid #e5e5e5;
    padding-top:20px;
  }
  .br{
    border-radius:100px;
  }
  .m1510{
    margin:15px 0 10px 10px
  }
  .mp{
    margin-left:20px;
    padding:15px 0 0 0px;
  }
  .replyTextarea,.DreplyTextarea{
    display:none;
    position:relative;
  }
  .mt8{
    margin-top:8px
  }
  .br20{
    border-radius: 20px;
  }
  .m15{
    margin:15px
  }
  .topInput,.rewardInput{
    display:none;
    width:200px;
  }
  .cancelTop,.definiteTop,.cancelReward,.definite{
    display:none;
    margin-left:10px;
  }
  .cancelAdoptBtn{
    width: 90px;
    height: 30px;
    background: #07a9e9;
    line-height: 10px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    border: 1px solid #07a9e9;
    // position: absolute;
    // bottom:10px;
    // right:30px;
    border-radius: 4px;
  }
  .definiteP{
    margin: 20px 0;
  }
  .topP{
    margin: 20px 0;
  }
  .fourBtn{
    margin-top: -20px;
  }
  .clearBoth{
    clear: both;
  }
  .definite,.rewardInput,.cancelReward,.definiteTop,.cancelTop,.topInput{
    float:right;
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
    // position: absolute;
    // bottom:10px;
    // right:30px;
    border-radius: 4px;
  }
  .topBtn{
    width: 85px;
    height: 30px;
    background: #07a9e9;
    line-height: 10px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    border: 1px solid #07a9e9;
    // position: absolute;
    // bottom:10px;
    // right:30px;
    border-radius: 4px;
  }
  .centerPage{
    text-align: center;
    margin-top:10px;
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
 