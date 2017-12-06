<template>
  <div id='newsDetail'>
    <el-row :gutter="20">
      <el-col :span='17'>
        <el-card class="pdfBox">
          <div class="formDown" slot="header">
            <el-row :gutter="20">
              <el-col class="formInfo" :span='19'>
                <p class="title">{{detail.title}}<i class=""></i></p>
                <p class="others"><i class="iconfont icon-eye"></i> <span>{{detail.browse}}</span><span class="time">{{detail.createTime | time('date')}}</span><span class="person">签发人 {{detail.createUser}}</span><span class="person">校对人 {{detail.verifyName}}</span></p>
              </el-col>
              <el-col :span='5' class="downBox">
                <p>下载</p>
                <a :href="detail.url" target="_blank" class="link">{{detail.title}}</a>
              </el-col>
            </el-row>
          </div>
          <div class="pdfScrollBox" ref="pdfScroll" v-loading="loading" :style="{height:pdfHeight+'px'}">
            <pdf :src="detail.url" v-if="detail.url" @numPages="getNums" @pageLoaded="pageLoad" ref="pdfPage" @error="pdfError"></pdf>
            <pdf :src="detail.url" v-if="totalNum&&num!=1" :page="num" v-for="num in totalNum"></pdf>
          </div>
          <el-pagination :current-page="pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="totalNum" v-on:current-change="changePage">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span='7'>
        <el-card class="borderCard searchBox">
          <div slot="header">新闻查询</div>
          <el-input class="search">
            <el-button slot="append">搜索</el-button>
          </el-input>
        </el-card>
        <duty></duty>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import SidePersonSearch from '../../components/sidePersonSearch.component'
import Duty from '../../components/duty.component'
import { mapGetters } from 'vuex'
import pdf from 'vue-pdf'
export default {
  components: { SidePersonSearch, Duty, pdf },
  data() {
    return {
      pageNum: 1,
      totalNum: 0,
      loading: true,
      detail: {
        title: '',
        url: '',
      },
      pdfHeight: 1070
    }

  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    changePage(newPage) {
      this.$refs.pdfScroll.scrollTop = this.pdfHeight * (newPage - 1);
    },
    getDetail() {
      this.$http.post('/doc/selectFileDetail', { Id: this.$route.params.id, empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0 && res.data) {
            this.detail = res.data;
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        })
    },
    getNums(num) {
      if (num) {
        this.totalNum = num;
      }
    },
    pageLoad(num) {
      this.loading = false;
      this.pdfHeight = this.$refs.pdfPage.$el.clientHeight;
    },
    pdfError(obj) {
      this.loading = false;
      this.$message.error('PDF文件加载失败！')
    }
  }

}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#newsDetail {
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
      padding-bottom: 70px;
      .pdfScrollBox {
        width: 100%;
        overflow-y: auto;
        height: 1070px;
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
