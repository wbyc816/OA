<template>
  <div class="manuscriptDetail">
    <el-col :span="24">
      <h1 class="title">发文类型</h1>
      <p v-if="info" class="textContent">{{info[0].classify1}}</p>
    </el-col>
    <!-- <el-col :span="12">
      <h1 class="title">发文日期</h1>
      <p v-if="info" class="textContent">{{info[0].issueDate | time('date')}}</p>
    </el-col> -->
    <el-col :span="24">
      <h1 class="title">发文目录</h1>
      <p v-if="info" class="textContent">{{info[0].catalogueName}}</p>
    </el-col>
    <!-- <el-col :span="24">
      <h1 class="title">发布范围</h1>
      <p v-if="info" class="textContent">
        <el-tag :key="send" type="primary" v-for="send in info[0].sendIds">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">主送</h1>
      <p v-if="info" class="textContent">
        <el-tag :key="send" type="primary" v-for="send in info[0].mainPeople">
          {{send}}
        </el-tag>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">抄送</h1>
      <p v-if="info" class="textContent">
        <el-tag :key="send" type="primary" v-for="send in info[0].ccPeople">
          {{send}}
        </el-tag>
      </p>
    </el-col> -->
   <!--  <el-col :span="12" class="rightBorder">
      <h1 class="title">签发人</h1>
      <p v-if="info" class="textContent">{{info[0].signId}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">校对人</h1>
      <p v-if="info" class="textContent">{{info[0].verifyId}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">打印份数</h1>
      <p v-if="info" class="textContent">{{info[0].printNum}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">存档份数</h1>
      <p v-if="info" class="textContent">{{info[0].storeNum}}</p>
    </el-col> -->
    <el-col :span="24">
      <h1 class="title">正文</h1>
      <p v-if="info" class="textContent">
        <a :href="info[0].toRedUrl" target="_blank" style="color:#0460AE" v-if="state!=3">{{info[0].fielName}}</a>
        <a :href="info[0].url" target="_blank" style="color:#0460AE" v-else>{{info[0].fielName}}</a>
      </p>
    </el-col>
    <!-- <div class="pdfBox clearBoth">
      <div class="pdfScrollBox" ref="pdfScroll" :style="{height:pdfHeight+'px',overflowY:totalNum>1?'auto':'hidden'}" v-if="first">
        <pdf :src="info[0].pdfUrl" @numPages="getNums" @pageLoaded="pageLoad" ref="pdfPage" @error="pdfError"></pdf>
        <pdf :src="info[0].pdfUrl" v-if="totalNum&&num!=1" :page="num" v-for="num in totalNum"></pdf>
      </div>
      <el-pagination :current-page="pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="totalNum" v-on:current-change="changePage">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'


export default {
  components: {  },
  props: {
    info: {
      type: Array
    },
    state: '',
    open:''
  },
  data() {
    return {
      types: [],
      pageNum: 1,
      totalNum: 0,
      pdfHeight: 900,
      first:false
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  created() {
    this.getType();
  },
  watch:{
    // open:function(newval){
    //   if(newval&&!this.first){
    //     this.first=true;
    //   }
    // }
  },
  mounted(){
    this.first=true;
  },
  methods: {
    getType() {
      this.$http.post('/api/getDict', { dictCode: 'ADM04' })
        .then(res => {
          if (res.status == '0') {
            this.types = res.data;
          } else {
            console.log('获取发文类型失败')
          }
        }, res => {

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
.manuscriptDetail {
  .el-input {
    width: 100%;
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

</style>
