<template>
  <div id='newsDetail'>
    <el-card class="pdfBox">
      <div class="formDown" slot="header">
        <el-row :gutter="20">
          <el-col class="formInfo" :span='19'>
            <p class="title">{{detail.fileNameOld}}<i class=""></i></p>
            <p class="others"><i class="iconfont icon-eye"></i><span>{{detail.browse}}</span><span class="time">{{detail.createTime | time}}</span><span class="person">类别：{{detail.name}}</span><span class="person">级别：{{detail.majorName}}</span></p>
          </el-col>
          <el-col :span='5' class="downBox">
            <p>下载</p>
            <a :href="detail.fileUrlNew" class="link">{{detail.fileNameOld}}</a>
          </el-col>
        </el-row>
      </div>
      <div class="pdfScrollBox" ref="pdfScroll" v-loading="loading">
        <canvas :id="'newsCanvas'+num" v-for="num in pafParam.total"></canvas>
      </div>
      <el-pagination :current-page="pafParam.pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="pafParam.total" v-on:current-change="changePage">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import pdf from '../../assets/pdf/test.pdf'
import pdfjsLib from 'pdfjs-dist'
import SidePersonSearch from '../../components/sidePersonSearch.component'
import Duty from '../../components/duty.component'

export default {
  components: { SidePersonSearch, Duty },
  data() {
    return {
      checked: false,
      pafParam: {
        pageNum: 1,
        pageRendering: false,
        total: 0
      },
      loading: false,
      pdfDoc: null,
      pageNumPending: null,
      detail: ""
    }

  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    initPdf() {
      this.loading = true;
      pdfjsLib.PDFJS.workerSrc = '../pdf.worker.js';
      console.log(this.detail)
      var loadingTask = pdfjsLib.getDocument(decodeURI(this.detail.fileUrlNew));
      var that = this;
      loadingTask.promise.then(function(pdfDoc_) {
        that.pdfDoc = pdfDoc_;
        console.log(pdfDoc_);
        that.pafParam.total = pdfDoc_.numPages;
        that.$nextTick(function() {
          for (var i = 0; i < that.pafParam.total; i++) {
            that.renderPage(i + 1);
          }
        })
      }).catch(function(reason) {
        console.error('Error: ' + reason);
      });
    },
    renderPage(num) {
      this.pageRendering = true;
      var that = this;
      that.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(1.4);
        var canvas = document.getElementById('newsCanvas'+ num);
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
          that.pageRendering = false;
          if (that.pageNumPending !== null) {

            that.renderPage(that.pageNumPending);
            that.pageNumPending = null;
          }
          if (num == that.pafParam.total) {
            that.loading = false;
          }
        });
      });
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    onPrevPage() {
      if (this.pafParam.pageNum <= 1) {
        return;
      }
      this.pafParam.pageNum--;
      this.queueRenderPage(this.pafParam.pageNum);
    },
    onNextPage() {
      if (this.pafParam.pageNum >= this.pafParam.total) {
        return;
      }
      this.pafParam.pageNum++;
      this.queueRenderPage(this.pafParam.pageNum);
    },
    changePage(newPage) {
      this.$refs.pdfScroll.scrollTop = 1070*(newPage-1);
    },
    getDetail() {
      this.$http.post('/index/selectByFileId', { fileId: this.$route.params.id, empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0 && res.data) {
            this.detail = res.data;
            this.initPdf();
          }
        })
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
      height: 1150px;
      position: relative;
      text-align: center;
      padding-top: 10px;
      #newsCanvas {
        height: 1070px;
        max-width: 800px;
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
