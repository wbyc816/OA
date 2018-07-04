<template>
  <div class="FWGDetail">
    <el-col :span="12" class="rightRedBorder">
      <h1 class="title rightRedBorder">签发人</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].signId}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title rightRedBorder">校对人</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].verifyId}}</p>
    </el-col>
    <template v-if="info[0]&&info[0].classify1!='部门发文'">
      <el-col :span="24" class="redBorder">
        <h1 class="title rightRedBorder">公司领导意见</h1>
        <p class="textContent">
          <template v-for="adviceBox in otherAdvice.empSign">
            <!-- <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span> -->
            <div v-for="advice in adviceBox.deptSigns">
              <el-col :span="24" class="noBorder ">
                <div >{{advice.signContent}}</div>
                <div class="chaetosema">{{advice.signUserName}} {{advice.signTime}}</div>
              </el-col>
            </div>
          </template>
        </p>
      </el-col>
      <el-col :span="24" class="redBorder">
        <h1 class="title rightRedBorder">综合管理部意见</h1>
        <p class="textContent">
          <!-- <span v-for="advice in otherAdvice.givenDeptSign" class="adviceSpan">{{advice.taskContent}} {{advice.taskUserName}} {{advice.startTime}}</span> -->
          <template v-for="advice in otherAdvice.givenDeptSign" >
            <div>
              <el-col :span="24" class="noBorder">
                <div  >{{advice.taskContent}}</div>
                <div class="chaetosema">{{advice.taskUserName}} {{advice.startTime}}</div>
              </el-col>
            </div>
          </template>
        
        </p>
      </el-col> 
      <el-col :span="24"  class="redBorder">
        <h1 class="title rightRedBorder">部门会签意见</h1>
        <p class="textContent">
           <template v-for="adviceBox in otherAdvice.deptSign" v-if="adviceBox.deptName!='综合管理部'">
              <div v-for="advice in adviceBox.deptSigns" >
                 <el-col :span="24" class="noBorder">
                  <div >{{advice.signContent}}</div>
                  <div class="chaetosema">{{advice.signUserName}} {{advice.signTime}}</div>
                </el-col>
              </div>
          </template>
        </p>
      </el-col>
    </template>
    <el-col :span="24" id="deptDetail" class="redBorder">
      <h1 class="title rightRedBorder">拟稿部门意见</h1>
      <p class="textContent">
        <template v-for="advice in otherAdvice.deptDetail">
          <div>
            <el-col :span="24" class="noBorder">
              <div  >{{advice.taskContent}}</div>
              <div class="chaetosema">{{advice.taskUserName}} {{advice.startTime}}</div>
            </el-col>
          </div>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">附件</h1>
      <p class="attch textContent pdl25">
        <template v-if="docDetialInfo&&docDetialInfo.taskFile.length>0">
          <a :href="file.filePath" target="_blank" v-for="file in docDetialInfo.taskFile">{{file.fileNameNew}}</a>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">主送</h1>
      <p v-if="info[0]" class="textContent pdl25">
        <el-tag :key="send" type="primary" v-for="send in info[0].mainPeople">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder ">抄送</h1>
      <p v-if="info[0]" class="textContent pdl25">
        <el-tag :key="send" type="primary" v-for="send in info[0].ccPeople">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">发布范围</h1>
      <p v-if="info[0]" class="textContent pdl25">
        <el-tag :key="send" type="primary" v-for="send in info[0].sendIds">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="12" class="rightRedBorder">
      <h1 class="title rightRedBorder">打印份数</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].printNum}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title rightRedBorder">存档份数</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].storeNum}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">发文日期</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].issueDate | time('date')}}</p>
    </el-col>
    <!-- <div class="pdfBox clearBoth" v-if="info[0]">
      <div class="pdfScrollBox" ref="pdfScroll" :style="{height:pdfHeight+'px',overflowY:totalNum>1?'auto':'hidden'}">
        <pdf :src="info[0].pdfUrl" @numPages="getNums" @pageLoaded="pageLoad" ref="pdfPage" @error="pdfError"></pdf>
      </div>
      <el-pagination :current-page="pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="totalNum" v-on:current-change="changePage">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import pdf from 'vue-pdf'
import pdf from '../../../components/pdf.component'
export default {
  components: { pdf },
  props: {
    info: {
      type: Array
    },
    docDetialInfo: '',
  },
  data() {
    return {
      otherAdvice: '',
      pageNum: 1,
      totalNum: 0,
      pdfHeight: 900,
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'userInfo'
    ])
  },
  created() {
    this.getOtherAdvice(this.$route);
  },
  beforeRouteUpdate(to, from, next) {
    this.getOtherAdvice(to);
    next();
  },
  watch: {
    // open:function(newval){
    //   if(newval&&!this.first){
    //     this.first=true;
    //   }
    // }
  },
  mounted() {
    this.addClass();
  },
  methods: {
   addClass(){
      document.getElementsByClassName("titleSpan")[0].setAttribute("style","border-bottom: 1px solid red;padding:0 0 0 24px");
    },
    getOtherAdvice(route) {
     this.$http.post("/emp/getEmpInfoById", {id: this.userInfo.empId})
        .then(res => {
          if (res.status == 0) {
            this.detail = res.data

             this.$http.post("/doc/getDetailByType", { id: route.params.id, empId: this.userInfo.empId,empPostId:this.docDetialInfo.doc.postId||this.detail.empPost[0].id })
              .then(res => {
                if (res.status == 0) {
                  this.otherAdvice = res.data
                } else {

                }
              })
          } else {

          }
        })
    },
    changePage(newPage) {
      this.$refs.pdfScroll.scrollTop = this.pdfHeight * (newPage - 1);
    },
    getNums(num) {
      if (num) {
        this.totalNum = num;
      }
    },
    pageLoad(num) {
      this.pdfHeight = this.$refs.pdfPage.$refs.page1[0].clientHeight;            
    },
    pdfError(obj) {
      this.$message.error('PDF文件加载失败！')
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.FWGDetail {
  .chaetosema{
      float:right;
      font-size:14px
  }
  .pdfBox {
    padding: 0;
    position: relative;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 50px;
    .pdfScrollBox {
      margin: 0 auto;
      width: 80%;
      overflow-y: auto;
      height: 800px;
      overflow-x: hidden;
      border-bottom: 1px solid #F2F2F2;
    }
    .el-pagination {
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
      bottom: 10px;
    }
  }
}

 
  #docDetail  .baseInfoBox .FWGDetail   .el-col {
    border-bottom: 1px solid red;
    padding: 0px 0px 0px 24px;
  }
  #docDetail  .baseInfoBox .FWGDetail  .redBorder {
    border-bottom: 1px solid red;
    padding: 0px 0px 0px 24px;
  }
  #docDetail  .baseInfoBox .FWGDetail .textContent .redBorder {
    border-bottom: 1px solid red;
  }
  #docDetail  .baseInfoBox .FWGDetail .textContent div .noBorder{
     border: 0px;
  }
  #docInfo  .baseInfoBox .FWGDetail   .el-col {
    border-bottom: 1px solid red;
    padding: 0px 0px 0px 24px;
  }
  #docInfo  .baseInfoBox .FWGDetail  .redBorder {
    border-bottom: 1px solid red;
    padding: 0px 0px 0px 24px;
  }
  #docInfo  .baseInfoBox .FWGDetail .textContent .redBorder {
    border-bottom: 1px solid red;
  }
  #docInfo  .baseInfoBox .FWGDetail .textContent div .noBorder{
     border: 0px;
  }
  .rightRedBorder{
    border-right:1px solid red;
  }
</style>
