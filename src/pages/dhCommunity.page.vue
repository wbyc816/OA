<template>
  <div id="dhCommunity">
   
    <div class="imgBox">
      <!-- :src="pics"  -->
      <img  src="http://filetest.donghaiair.cn/pic/title/2018-04-20/11-25-11/png/%E6%9C%AA%E6%A0%87%E9%A2%98-1.png" alt="" >
    </div> 
    <!-- highLight -->

   
    <el-card class="contentWidth">
        <el-row :gutter="60">
          <el-col :span="17">
            <el-tabs v-model="activeName" @tab-click="handleClick" >
              <el-tab-pane label="服务" name="first">
                <el-row>
                  <div v-for="(item,index) in serverDatas" v-if="index<10" >
                    <div @click="goTo(item.forum.id)" class="cBmT cursor">
                      <p class="title">{{index+1}} <span>{{item.forum.forumTitle}}</span></p>
                      <p class="taskContent" v-html="item.forum.taskContent1"></p>
                      <p class="encourage">公司为奖励员工建议特设奖金希望大家献言献策，踊跃参加</p>
                      <ul v-for="(imgSrc,index) in item.imageList" class="imgUl">
                        <li><img v-if="imgSrc.nameNew" :src="imgSrc.nameNew" width="800" height="240"></li>
                      </ul>
                      <p class="timeInfor"> 
                        <span class="createTime">{{item.forum.createTime}}发布</span> 截止日期：{{item.forum.limitTime}}
                        <ul class="threeUl">
                          <li><i class="iconfont icon-Group23"></i>奖金 <span class="FFcolor">{{item.rewardCount}}</span></li>
                          <li><i class="iconfont icon-Group4"></i>评论 <span class="FFcolor">{{item.replyCount}}</span></li>
                          <li><i class="iconfont icon-dianzan"></i>点赞 <span class="FFcolor">{{item.praiseCount}}</span></li>
                        </ul>
                       </p>
                       <hr class="hr">
                    </div>
                  </div>
                </el-row>

                <div class="pageBox centerPageBox"  v-if="totalSizeServer>0">
                  <el-pagination @current-change="handleCurrentChangeServer" :current-page="pageNumberServer" :page-size="2" layout="total, prev, pager, next, jumper" :total="totalSizeServer">
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane label="安全" name="second"> 
                <el-row>
                  <div v-for="(item,index) in safeDatas" v-if="index<10" >
                    <div @click="goTo(item.forum.id)" class="cBmT">
                      <p class="title">{{index+1}} <span>{{item.forum.forumTitle}}</span></p>
                      <p class="taskContent"  v-html="item.forum.taskContent1"></p>
                      <p class="encourage">公司为奖励员工建议特设奖金希望大家献言献策，踊跃参加</p>
                      <ul v-for="(imgSrc,index) in item.imageList" class="imgUl">
                        <li><img v-if="imgSrc.nameNew" :src="imgSrc.nameNew" width="800" height="240"></li>
                      </ul>
                      <!-- <p class="timeInfor"> {{item.forum.createTime}}发布 截止日期：{{item.forum.limitTime}} <i class="iconfont icon-dianzan"></i>点赞 {{item.forum.praiseCount}}<i class="iconfont icon-Group4"></i>评论 {{item.forum.replyCount}}<i class="iconfont icon-Group23"></i>奖金 {{item.forum.rewardCount}}</p> -->
                      <p class="timeInfor"> 
                        <span class="createTime">{{item.forum.createTime}}发布</span> 截止日期：{{item.forum.limitTime}}
                        <ul class="threeUl">
                          <li><i class="iconfont icon-Group23"></i>奖金 <span class="FFcolor">{{item.rewardCount}}</span></li>
                          <li><i class="iconfont icon-Group4"></i>评论 <span class="FFcolor">{{item.replyCount}}</span></li>
                          <li><i class="iconfont icon-dianzan"></i>点赞 <span class="FFcolor">{{item.praiseCount}}</span></li>
                        </ul>
                       </p>
                       <hr class="hr">
                    </div>
                    
                  </div>
                </el-row>

                <div class="pageBox centerPageBox" v-if="totalSizeSafe>0">
                  <el-pagination @current-change="handleCurrentChangeSafe" :current-page="pageNumberSafe" :page-size="2" layout="total, prev, pager, next, jumper" :total="totalSizeSafe">
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane label="效益" name="third">
                <el-row>
                  <div v-for="(item,index) in benefitDatas" v-if="index<10" >
                    <div @click="goTo(item.forum.id)" class="cBmT">
                      <p class="title">{{index+1}} <span>{{item.forum.forumTitle}}</span></p>
                      <p class="taskContent"  v-html="item.forum.taskContent1"></p>
                      <p class="encourage">公司为奖励员工建议特设奖金希望大家献言献策，踊跃参加</p>
                      <ul v-for="(imgSrc,index) in item.imageList" class="imgUl">
                        <li><img v-if="imgSrc.nameNew" :src="imgSrc.nameNew" width="800" height="240"></li>
                      </ul>
                      <!-- <p class="timeInfor"> {{item.forum.createTime}}发布 截止日期：{{item.forum.limitTime}} <i class="iconfont icon-dianzan"></i>点赞 {{item.forum.praiseCount}}<i class="iconfont icon-Group4"></i>评论 {{item.forum.replyCount}}<i class="iconfont icon-Group23"></i>奖金 {{item.forum.rewardCount}}</p> -->
                       <p class="timeInfor"> 
                        <span class="createTime">{{item.forum.createTime}}发布</span> 截止日期：{{item.forum.limitTime}}
                        <ul class="threeUl">
                          <li><i class="iconfont icon-Group23"></i>奖金 <span class="FFcolor">{{item.rewardCount}}</span></li>
                          <li><i class="iconfont icon-Group4"></i>评论 <span class="FFcolor">{{item.replyCount}}</span></li>
                          <li><i class="iconfont icon-dianzan"></i>点赞 <span class="FFcolor">{{item.praiseCount}}</span></li>
                        </ul>
                       </p>
                       <hr class="hr">
                    </div>
                  </div>
                </el-row>
                <div class="pageBox centerPageBox" v-if="totalSizeBenefit>0">
                  <el-pagination @current-change="handleCurrentChangeBenefit" :current-page="pageNumberBenefit" :page-size="2" layout="total, prev, pager, next, jumper" :total="totalSizeBenefit">
                  </el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="7">
          <el-card class="reward">
            <div slot="header" class="clearfix">
              <span class="header">奖金榜</span> <span class="cr">(奖池剩余{{leftMoney}}元)</span>
            </div>
            <table width="100%" cellspacing="0" >
              <tbody v-for="(item,index) in rewardDatas"  class="cursor">
                <tr @click="rewardDetail(item.empId,item.rewardCount)" >
                  <td class="pt10"><div class="circle"  v-bind:class="{ 'first-circle': index+(pageNumberReward-1)*5==0,'two-circle': index+(pageNumberReward-1)*5==1,'three-circle': index+(pageNumberReward-1)*5==2 }">{{index+1+(pageNumberReward-1)*5}}</div></td>
                  <td>{{item.empName}}</td>
                  <td class="deptColor">{{item.deptMajorName}}</td>
                  <td>￥<span class="colorRed">{{item.rewardCount}}</span></td>
                </tr>
               
              </tbody>
              <tbody v-if="rewardDatas==''||rewardDatas==[]" class="tac">
                <tr >
                  <td >暂无数据</td>
                </tr>
              </tbody>
              
            </table>  

            <hr  class="hr m15">
            <div class="pageBox" v-if="totalSizeReward>0">
              <el-pagination @current-change="handleCurrentChangeReward" :current-page="pageNumberReward" :page-size="5" layout="total, prev, pager, next" :total="totalSizeReward">
              </el-pagination>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="header">采纳榜</span>
            </div>
            <!-- <div v-for="(item,index) in adoptDatas"  >
              <div @click="adoptDetail(item.empId)">
                {{index+1}}
                {{item.empName}}
                {{item.deptMajorName}}
                {{item.adoptCount}}
              </div>
            </div> -->
            <table width="100%" cellspacing="0">
              <tbody v-for="(item,index) in adoptDatas"  class="cursor">
                <tr @click="adoptDetail(item.empId)">
                  <td class="pt10"><div class="circle"  v-bind:class="{ 'first-circle': index+(pageNumberAdopt-1)*5==0,'two-circle': index+(pageNumberAdopt-1)*5==1,'three-circle': index+(pageNumberAdopt-1)*5==2 }">{{index+1+(pageNumberAdopt-1)*5}}</div></td>
                  <td>{{item.empName}}</td>
                  <td class="deptColor">{{item.deptMajorName}}</td>
                  <td><span>{{item.adoptCount}}</span></td>
                </tr>
              </tbody>
              <tbody v-if="adoptDatas==''||adoptDatas==[]" class="tac">
                <tr>
                  <td >暂无数据</td>
                </tr>
              </tbody>
            </table>  
            <hr  class="hr m15">
            <div class="pageBox" v-if="totalSizeAdopt>0">
              <el-pagination @current-change="handleCurrentChangeAdopt" :current-page="pageNumberAdopt" :page-size="5" layout="total, prev, pager, next" :total="totalSizeAdopt">
              </el-pagination>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="header">点赞榜</span>
            </div>
            <!-- <div v-for="(item,index) in praiseDatas"  >
              <div @click="praiseDetail(item.empId,item.praiseCount)">
                {{index+1}}
                {{item.empName}}
                {{item.deptMajorName}}
                {{item.praiseCount}}
              </div>
            </div> -->
            <table width="100%" cellspacing="0">
              <tbody v-for="(item,index) in praiseDatas" class="cursor">
                <tr @click="praiseDetail(item.empId,item.praiseCount)">
                  <td class="pt10"><div class="circle"  v-bind:class="{ 'first-circle': index+(pageNumberPraise-1)*5==0,'two-circle': index+(pageNumberPraise-1)*5==1,'three-circle': index+(pageNumberPraise-1)*5==2 }">{{index+1+(pageNumberPraise-1)*5}}</div></td>
                  <td>{{item.empName}}</td>
                  <td class="deptColor">{{item.deptMajorName}}</td>
                  <td><span>{{item.praiseCount}}</span></td>
                </tr>
              </tbody>
              <tbody v-if="praiseDatas==''||praiseDatas==[]" class="tac">
                <tr >
                  <td >暂无数据</td>
                </tr>
              </tbody>
            </table>  
            <hr class="hr m15">
            <div class="pageBox" v-if="totalSizePraise>0">
              <el-pagination  @current-change="handleCurrentChangePraise" :current-page="pageNumberPraise" :page-size="5" layout="total, prev, pager, next" :total="totalSizePraise">
              </el-pagination>
            </div>
          </el-card>
            

          </el-col>
        </el-row>

        <p class="fs20" v-if="contributeDatas">员工贡献榜</p>
        <div v-for="(item,index) in contributeDatas"  class="contribute cursor">
          <div @click="contributeDetail(item.empId,item.rewardCount,item.adoptCount,item.praiseCount)">
            <img v-if="item.picUrl" :src="item.picUrl" alt="" width="220"  height="220" > 
            <img v-if="!item.picUrl"  src="../assets/images/blankHead.png"  width="220"  height="220" >
            <span class="name">{{item.empName}}</span>
            <p class="timeInfor">
              <ul class="contributeThreeUl">
                <li><i class="iconfont icon-dianzan"></i> <span class="FFcolor">{{item.praiseCount}}</span></li>
                <li><i class="iconfont icon-Group4"></i> <span class="FFcolor">{{item.replyCount}}</span></li>
                <li><i class="iconfont icon-Group23"></i> <span class="FFcolor">{{item.rewardCount}}</span></li>
              </ul>
              
              <!-- <i class="iconfont icon-dianzan"></i>点赞 {{item.praiseCount}}<i class="iconfont icon-Group4"></i>评论 {{item.replyCount}}<i class="iconfont icon-Group23"></i>奖金 {{item.rewardCount}} -->
              </p>
          </div>
        </div>
        <div class="pageBox centerPageBox" v-if="totalSizeContribute>0">
          <el-pagination  @current-change="handleCurrentChangeContribute" :current-page="pageNumberContribute" :page-size="15" layout="total, prev, pager, next, jumper" :total="totalSizeContribute">
          </el-pagination>
        </div>
    </el-card>
    

  

  
  </div>
   
</template>
<script>

import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      leftMoney:"",
      activeName: 'first',
      pics: [],
      serverDatas: [],
      safeDatas: [],
      benefitDatas: [],
      rewardDatas:[],
      praiseDatas:[],
      adoptDatas:[],
      pageNumberServer:1,
      pageNumberSafe:1,
      pageNumberBenefit:1,
      pageNumberReward:1,
      pageNumberPraise:1,
      pageNumberAdopt:1,
      totalSizeServer: 0,
      totalSizeSafe: 0,
      totalSizeBenefit: 0,
      totalSizePraise: 0,
      totalSizeAdopt: 0,
      totalSizeReward:0,
      contributeDatas: [],
      pageNumberContribute:1,
      totalSizeContribute: 0,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    this.getPics();
    this.getChildPic();
    this.getServerData();
    this.getSafeData();
    this.getBenefitData();

    this.getRewardData();
    this.getAdoptData();
    this.getPraiseData();
    this.getContributeData();
    this.getLeftMoney();
  },
  methods: {
    getLeftMoney(){
       this.$http.post('/forum/getRewardMoney')
        .then(res => {
          if (res.status == 0) {
            this.leftMoney = res.data.money;
          }
        })
    },
    rewardDetail(empid,rewardCount){
      this.$router.push('/rewardDetail/' + empid+"/"+rewardCount);
    },
    adoptDetail(empid){
      this.$router.push('/adoptDetail/' + empid);
    },
    praiseDetail(empid,praiseCount){
      this.$router.push('/praiseDetail/' + empid+"/"+praiseCount);
    },
    contributeDetail(empid,rewardCount,adoptCount,praiseCount){
      this.$router.push('/contributeDetail/' + empid+"/"+rewardCount+"/"+adoptCount+"/"+praiseCount);
    },
    goTo(data) {
      window.open(location.href.slice(0,location.href.indexOf("#")+1)+'/forumDetail/' + data)
      // this.$router.push('/forumDetail/' + data);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleCurrentChangeContribute(page) {
      this.pageNumberContribute = page;
      this.getContributeData()
    },
    handleCurrentChangeServer(page) {
      this.pageNumberServer = page;
      this.getServerData()
    },
    handleCurrentChangeSafe(page) {
      this.pageNumberSafe = page;
      this.getSafeData()
    },
    handleCurrentChangeBenefit(page) {
      this.pageNumberBenefit = page;
      this.getBenefitData()
    },

    handleCurrentChangeReward(page) {
      this.pageNumberReward = page;
      this.getRewardData()
    },
    handleCurrentChangeAdopt(page) {
      this.pageNumberAdopt = page;
      this.getAdoptData()
    },
    handleCurrentChangePraise(page) {
      this.pageNumberPraise = page;
      this.getPraiseData()
    },
    getPics() {
      this.$http.post('/index/getBasicImage', { imageType: 'ADM0602' })
        .then(res => {
          if (res.status == 0) {
            this.pics = res.data[0];
          }
        })
    },
    getChildPic() {
      this.$http.post('/index/getBasicImage', { imageType: 'ADM0603' })
        .then(res => {
          if (res.status == 0) {
            this.childPic = res.data[0];
          }
        })
    },
    getContributeData() {
      this.$http.post("/forum/getContributeList", {
        "type":4,
        "pageNumber": this.pageNumberContribute,
        "pageSize": 15
      }).then(res => {
        if (res.status == 0) {
          this.totalSizeContribute = res.data.total;
          this.contributeDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    },
    getServerData() {
      this.$http.post("/forum/selectForumList", {
        "forumType1":"FUM0101",
        "pageNumber": this.pageNumberServer,
        "pageSize": "2",
         displayType:1,
      }, { body: true }).then(res => {
        if (res.status == 0) {
          this.totalSizeServer = res.data.total;
          this.serverDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    },
    getSafeData() {
       this.$http.post("/forum/selectForumList", {
        "forumType1":"FUM0102",
        "pageNumber": this.pageNumberSafe,
        "pageSize": "2",
        displayType:1,
      }, { body: true }).then(res => {
        if (res.status == 0) {
          this.totalSizeSafe = res.data.total;
          this.safeDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    },
    getBenefitData() {  
       this.$http.post("/forum/selectForumList", {
        "forumType1":"FUM0103",
        "pageNumber": this.pageNumberBenefit,
        "pageSize": "2",
        displayType:1,
      }, { body: true }).then(res => {
        if (res.status == 0) {
          this.totalSizeBenefit = res.data.total;
          this.benefitDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    },

    getRewardData() {  
       this.$http.post("/forum/getContributeList", {
        "type":1,
        "pageNumber": this.pageNumberReward,
        "pageSize": 5
      }).then(res => {
        if (res.status == 0) {
          this.totalSizeReward = res.data.total;
          this.rewardDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    },
    getAdoptData() {  
       this.$http.post("/forum/getContributeList", {
        "type":2,
        "pageNumber": this.pageNumberAdopt,
        "pageSize": 5
      }).then(res => {
        if (res.status == 0) {
          this.totalSizeAdopt = res.data.total;
          this.adoptDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    },
    getPraiseData() {  
       this.$http.post("/forum/getContributeList", {
        "type":3,
        "pageNumber": this.pageNumberPraise,
        "pageSize": 5
      }).then(res => {
        if (res.status == 0) {
          this.totalSizePraise = res.data.total;
          this.praiseDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    }
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;

#dhCommunity {
  .cr{
    color:red
  }
  .el-tabs__item{
    font-size: 20px;
  }
  .contentWidth{
    width:1200px;
  }
  .tac{
    text-align:center
  }
  .cursor{
    cursor:pointer
  }
  .name{
    margin-left: 5px
  }
  .contribute{
    display:inline-block;
    margin:15px 12px 0 0;
    width:220px;
    border:1px solid #d5dadf;
  }
  .fs20{
    font-size: 20px
  }
  .colorRed{
    color:red;
  }
  .pt10{
    padding-top:10px;
  }
  .m15{
    margin: 15px 0;
  }
  .clearfix{
    text-align: center
  }
  .header,.deptColor{
    color: #0170cb;
  }
  .cBmT{
    clear:both;
    margin-top:20px;
  }
  .centerPageBox{
    margin:20px;
    text-align:center;
  }
  .createTime{
    margin-right: 20px;
    display: inline-block;
  }
  .FFcolor{
    color:#ff9300;
  }
  .contributeThreeUl{
     display: inline-block;
    // border:1px solid red;
    float: left;
    margin-left: 5px;
    // margin-top:8px 
  }
  .contributeThreeUl li{
    // border:1px solid #ccc;
    height: 20px;
    line-height: 20px;
    float: left;
    font-size:14px ;
    margin:5px 0;
    width: 70px;
    // margin-right:20px;
  }
  .contributeThreeUl li:last-child{
    // border-right:0
    // margin-left:0;
  }
  .threeUl {
    display: inline-block;
    // border:1px solid red;
    float: right;
    margin-top:8px 
  }
  
  .threeUl li{
    border-right:1px solid #ccc;
    height: 20px;
    line-height: 20px;
    float: right;
    font-size:14px ;
    margin-left: 20px;
    padding-right: 20px;
  }
  .threeUl li:first-child{
    border: 0;
  }
  .hr{
    background-color: #d5dadf;
    border:none;
    height: 1px;
    clear: both;
    // margin-top: 25px;
  }
  .circle{
    border:1px solid #d5dadf;
    background: #d5dadf;
    border-radius:20px;
    color: #fff;
    width:20px;
    height:20px;
    text-align: center;
    line-height: 18px;
    display: inline-block;
  }
  .first-circle{
    background:#be3b7f;
    border:1px solid #be3b7f;
  }
  .two-circle{
    background:#ff9300;
    border:1px solid #ff9300;
  }
  .three-circle{
    background:#ffd702;
    border:1px solid #ffd702;
  }
  .timeInfor{
    font-size:14px;
    line-height:40px;
    color:#95989A;
  }
  .title{
     
    font-size:20px;
    line-height:40px;
    color:#0170cb;
  }
  .imgUl{
    margin-top:8px;
  }
  .taskContent{
    font-size: 16px;
    color:#333;
  }
  .encourage{
    color:#7687CE;
    font-size: 16px;
    margin-top:13px;
  }
  .el-tabs__item{
    // border-right:1px solid #E1E1E1;
    width:267.3px;
    text-align: center
  }
  // .el-tabs__item:last-child{
  //   // border-right:0px solid #E1E1E1;
  //   width:240px;
  //   text-align: center
  // }
  .el-tabs__active-bar{
    width: 290px!important;
  }
  .el-tabs__nav{
    border:1px solid #E1E1E1;
  }
  // .searchDataBtn{
  //   border:1px solid #E1E1E1;
  //   height: 40px;
  //   width: 800px;
  //   overflow: hidden;
  //   padding-top:10px; 
  //   span{
  //     height: 20px;
  //     line-height: 20px;
      
  //     display: inline-block;
  //     width:263.4px;
  //     border-right:1px solid #E1E1E1;
     
  //     margin: 0;
  //     padding: 0;
  //     text-align: center;

  //   }
  //   :last-child{
  //     border-right:0;
  //   }
  // }


  // .circle{
  //   width: 100px;
  //   height: 100px;
  //   background-color:red;
  //   border-radius: 50%;
  //   -moz-border-radius: 50%;
  //   -webkit-border-radius: 50%;
  // }
  // .el-carousel {
  //   margin-bottom: 20px;
  // }
  // .highLight {
  //   .el-card__header {
  //     margin: 0 12px;
  //     padding: 0;
  //     line-height: 45px;
  //     color: $main;
  //     i {
  //       margin-right: 10px;
  //       font-size: 20px;
  //     }
  //     .headRight {
  //       font-size: 14px;
  //       color: #676767;
  //     }
  //   }
  //   .el-card__body {
  //     padding: 12px 0;
  //     .el-col {
  //       // padding: 12px 18px 0 14px;
  //       border-right: 1px solid #E9E9E9;
  //       div {
  //         padding: 14px 7px 10px;
  //         border-top: 1px solid #E9E9E9;
  //         color: #676767;
  //         cursor: pointer;
  //         p:first-child {
  //           font-size: 16px;
  //           line-height: 30px;
  //           white-space: nowrap;
  //           overflow: hidden;
  //           text-overflow: ellipsis;
  //           ;
  //           img {
  //             vertical-align: sub;
  //           //   padding-right: 5px;
  //           }
  //         }
  //         p:last-child {
  //           // margin-top: 10px;
  //           // font-size: 12px;
  //           span {
  //             float: right;
  //           }
  //         }
  //       }
  //     }
  //     .el-col:nth-child(-n+2) {
  //       // padding-top: 6px;
  //       div {
  //         padding-top: 0;
  //         border-top: none;
  //       }
  //     }
  //   }
  
//   .imgBox {
//     width: 100%;
//     margin-bottom: 20px;
//     img {
//       width: 100%;
//     }
//   }
//   .new {
//     font-size: 12px;
//     font-weight: normal;
//     background: #FF9300;
//     color: #fff;
//     border-radius: 2px;
//     padding: 0 2px;
//     vertical-align: top;
//   }
  .title {
    display: inline-block;
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
//   .shareBox {
//     .el-card__body {
//       padding: 0 12px;
//     }
//     .shareWith {
//       border-right: 1px solid #E9E9E9;
//       padding-right: 14px;
//       &>p {
//         font-size: 18px;
//         color: $main;
//         line-height: 45px;
//         border-bottom: 1px solid #E9E9E9;
//         padding: 0 15px 0 3px;
//         i {
//           font-size: 20px;
//           vertical-align: middle;
//           margin-right: 10px;
//         }
//         a:last-child {
//           float: right;
//           font-size: 14px;
//           color: #676767;
//           cursor: pointer;
//         }
//       }
//       ul {
//         li {
//           padding: 18px 7px 18px;
//           border-top: 1px solid #E9E9E9;
//           color: #676767;
//           cursor: pointer;
//           p:first-child {
//             font-size: 16px;
//             line-height: 23px;
//             img {
//               vertical-align: sub;
//               padding-right: 5px;
//             }
//           }
//           p:last-child {
//             margin-top: 10px;
//             font-size: 12px;
//             span {
//               float: right;
//             }
//           }
//         }
//         li:first-child {
//           border-top: none;
//         }
//       }
//     }
//     .myShare {
//       border: none;
//       padding-right: 0;
//       padding-left: 14px;
//       .purpleTip {
//         background: $main;
//         color: #fff;
//         padding: 5px 10px;
//         border-bottom-right-radius: 5px;
//         border-top-right-radius: 5px;
//       }
//       .greyTip {
//         background: #AAAAAA;
//       }
//     }
  // }
}

</style>
