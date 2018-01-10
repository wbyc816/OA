<template>
  <div id='diningMenu'>
    <el-row :gutter="20">
      <el-col :span='24'>
        <el-card class="pdfBox">
          <p class="tipInfo" v-if="showTip">食堂管理员暂未上传食谱</p>
          <pdf :src="detail" @numPages="getNums" :page="pageNum" @error="pdfError"></pdf>
          <el-pagination :current-page="pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="totalNum" v-on:current-change="changePage">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pdf from 'vue-pdf'

export default {
  components: {pdf},
  data() {
    return {
        pageNum: 1,
      detail: '',
      totalNum: 0,
      showTip:false
    }

  },
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    changePage(newPage) {
      this.pageNum = newPage;
    },
    getDetail() {
      this.$http.post('/index/getDiningMenu', )
        .then(res => {
          if (res.status == 0) {
            this.detail = res.data;
          }
        })
    },
    getNums(num) {
      if(num){
        this.totalNum=num;
      }
    },
    pdfError(obj){
      this.loading=false;
      // this.$message.error('PDF文件加载失败！')
      this.showTip=true;
    }
  }

}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#diningMenu {
  .divider {
    position: relative;
    margin-right: 7px;
    padding-right: 7px;
    &:before {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
      height: 13px;
      border-right: 1px solid #676767;
    }
  }
  .flRight {
    float: right;
  }
  .main {
    color: $main;
  }
  .formDown {
    box-shadow: none;
    .el-row {
      .formInfo {
        border-right: 1px solid #F2F2F2;
        .title {
          font-size: 18px;
          color: $sub;
          padding-bottom: 20px;
        }
        .others {
          font-size: 13px;
          i {
            color: $sub;
          }
        }
        .time {
          margin-left: 10px;
        }
        .person {
          margin-left: 15px;
        }
      }
      .downBox {
        font-size: 13px;
        .link {
          color: $main;
          cursor: pointer;
        }
      }
    }
  }
  .pdfBox {
    padding: 0;
    box-shadow: none;
    .el-card__body {
      padding: 0;
      position: relative;
      text-align: center;
      padding-top: 10px;
      .tipInfo{
        position:absolute;
        font-size:30px;
        top:200px;
        width: 100%;
        text-align:center;
      }
      #newsCanvas {}
      .el-pagination {
        margin: 0 auto;
        left: 0;
        right: 0;
        margin-bottom: 20px;
      }
    }
  }
  .searchBox {
    .el-card__header {
      border-bottom: none;
    }
    .el-card__body {
      padding-bottom: 20px;
    }
  }
}

</style>
