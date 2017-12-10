<template>
  <div class="FWGDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">签发人</h1>
      <p v-if="info[0]" class="textContent">{{info[0].signId}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">校对人</h1>
      <p v-if="info[0]" class="textContent">{{info[0].verifyId}}</p>
    </el-col>
    <template v-if="info[0]&&info[0].classify1!='部门发文'">
      <el-col :span="24">
        <h1 class="title">公司领导意见</h1>
        <p class="textContent">
          <template v-for="adviceBox in otherAdvice.empSign">
            <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
          </template>
        </p>
      </el-col>
      <el-col :span="24">
        <h1 class="title">综合管理部意见</h1>
        <p class="textContent">
          <span v-for="advice in otherAdvice.givenDeptSign" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
        </p>
      </el-col>
      <el-col :span="24">
        <h1 class="title">部门会签意见</h1>
        <p class="textContent">
          <template v-for="adviceBox in otherAdvice.deptSign" v-if="adviceBox.deptName!='综合管理部'">
            <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
          </template>
        </p>
      </el-col>
    </template>
    <el-col :span="24">
      <h1 class="title">拟稿部门意见</h1>
      <p class="textContent">
        <span v-for="advice in otherAdvice.deptDetail" class="adviceSpan">{{advice.taskContent}} {{advice.taskUserName}} {{advice.taskTime}}</span>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">附件</h1>
      <p class="attch textContent">
        <template v-if="docDetialInfo&&docDetialInfo.taskFile.length>0">
          <a :href="file.filePath" target="_blank" v-for="file in docDetialInfo.taskFile">{{file.fileNameNew}}</a>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">主送</h1>
      <p v-if="info[0]" class="textContent">
        <el-tag :key="send" type="primary" v-for="send in info[0].mainPeople">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">抄送</h1>
      <p v-if="info[0]" class="textContent">
        <el-tag :key="send" type="primary" v-for="send in info[0].ccPeople">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">发布范围</h1>
      <p v-if="info[0]" class="textContent">
        <el-tag :key="send" type="primary" v-for="send in info[0].sendIds">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">打印份数</h1>
      <p v-if="info[0]" class="textContent">{{info[0].printNum}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">存档份数</h1>
      <p v-if="info[0]" class="textContent">{{info[0].storeNum}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">发文日期</h1>
      <p v-if="info[0]" class="textContent">{{info[0].issueDate | time('date')}}</p>
    </el-col>
    <div class="pdfBox clearBoth" v-if="info[0]">
      <div class="pdfScrollBox" ref="pdfScroll" :style="{height:pdfHeight+'px',overflowY:totalNum>1?'auto':'hidden'}">
        <pdf :src="info[0].pdfUrl" @numPages="getNums" @pageLoaded="pageLoad" ref="pdfPage" @error="pdfError"></pdf>
        <pdf :src="info[0].pdfUrl" v-if="totalNum&&num!=1" :page="num" v-for="num in totalNum"></pdf>
      </div>
      <el-pagination :current-page="pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="totalNum" v-on:current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import pdf from 'vue-pdf'
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
      this.$http.post("/doc/getDetailByType", { id: route.params.id, empId: this.userInfo.empId })
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
      this.pdfHeight = this.$refs.pdfPage.$el.clientHeight;
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
