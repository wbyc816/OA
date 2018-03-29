<template>
  <div class="SWDDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">来文文号</h1>
      <p v-if="info[0]" class="textContent">{{info[0].wordNo}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">收文日期</h1>
      <p v-if="info[0]" class="textContent">{{info[0].receiveTime.slice(0,4)}}年{{info[0].receiveTime.slice(5,7)}}月{{info[0].receiveTime.slice(8,10)}}日</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">来文单位</h1>
      <p v-if="info[0]" class="textContent">{{info[0].receiveCompany}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">公司领导意见</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.empSign">
          <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">综合管理部<br/>拟办意见</h1>
      <p class="textContent">
        <span v-for="advice in otherAdvice.deptDetail" class="adviceSpan">{{advice.taskContent}} {{advice.taskUserName}} {{advice.startTime}}</span>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">承办部门意见</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.taskDeptSign">
          <template v-for="adviceChild in adviceBox.signInfo">
            <span v-for="advice in adviceChild.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
          </template>
        </template>
      </p>
    </el-col>
    <div class="pdfBox clearBoth" v-if="info[0]">
      <div class="pdfScrollBox" ref="pdfScroll" :style="{height:pdfHeight+'px',overflowY:totalNum>1?'auto':'hidden'}">
        <pdf :src="info[0].url" @numPages="getNums" @pageLoaded="pageLoad" ref="pdfPage" @error="pdfError"></pdf>
        <!-- <pdf :src="info[0].url" v-if="totalNum&&num!=1" :page="num" v-for="num in totalNum"></pdf> -->
      </div>
      <el-pagination :current-page="pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="totalNum" v-on:current-change="changePage">
      </el-pagination>
    </div>
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
  mounted() {},
  methods: {
    
    getOtherAdvice(route) {
      this.$http.post("/doc/getDetailByType", { id: route.params.id, empId: this.userInfo.empId,empPostId:this.docDetialInfo.doc.postId||this.userInfo.empPost[0].id })
        .then(res => {
          if (res.status == 0) {
            this.otherAdvice = res.data
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
.SWDDetail {
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

</style>
