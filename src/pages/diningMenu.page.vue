<template>
  <div id='diningMenu'>
    <el-row :gutter="20">
      <el-col :span='24'>
        <el-card class="pdfBox">
          <!-- <div class="formDown" slot="header">
            <el-row :gutter="20">
              <el-col class="formInfo" :span='19'>
                <p class="title">{{detail.title}}<i class=""></i></p>
                <p class="others"><i class="iconfont icon-eye"></i><span>{{detail.browse}}</span><span class="time">{{detail.createTime | time}}</span><span class="person">签发人 {{detail.createUser}}</span><span class="person">校对人 {{detail.verifyName}}</span></p>
              </el-col>
              <el-col :span='5' class="downBox">
                <p>附件</p>
                <p class="link">集团下发文件.pdf</p>
                <p class="link">集团下发文件.pdf</p>
              </el-col>
            </el-row>
          </div> -->
          <canvas id="newsCanvas"></canvas>
          <el-pagination :current-page="pafParam.pageNum" :page-size="1" layout="total, prev, pager, next, jumper" :total="pafParam.total" v-on:current-change="changePage">
          </el-pagination>
        </el-card>
      </el-col>
<!--       <el-col :span='7'>
        <el-card class="borderCard searchBox">
          <div slot="header">新闻查询</div>
          <el-input class="search">
            <el-button slot="append">搜索</el-button>
          </el-input>
        </el-card>
        <duty></duty>
      </el-col> -->
    </el-row>
  </div>
</template>
<script>
import pdfjsLib from 'pdfjs-dist'

export default {
  components: {  },
  data() {
    return {
      checked: false,
      pafParam: {
        pageNum: 1,
        pageRendering: false,
        total: 0
      },
      pdfDoc: null,
      pageNumPending: null,
      detail: ''
    }

  },
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    initPdf() {
      pdfjsLib.PDFJS.workerSrc = '../pdf.worker.js';
      console.log(this.detail)
      var loadingTask = pdfjsLib.getDocument(decodeURI(this.detail));
      var that = this;
      loadingTask.promise.then(function(pdfDoc_) {
        that.pdfDoc = pdfDoc_;
        console.log(pdfDoc_);
        that.pafParam.total = pdfDoc_.numPages;

        that.renderPage(that.pafParam.pageNum);
      }).catch(function(reason) {
        console.error('Error: ' + reason);
      });
    },
    renderPage(num) {
      this.pageRendering = true;
      var that = this;
      that.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(1.4);
        var canvas = document.getElementById('newsCanvas');
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
      console.log(newPage);
      console.log(this.pafParam.pageNum);
      if (newPage - this.pafParam.pageNum == 1) {
        this.onNextPage();
      } else if (newPage - this.pafParam.pageNum == -1) {
        this.onPrevPage();
      } else {
        this.renderPage(newPage);
      }
      this.pafParam.pageNum = newPage;
    },
    getDetail() {
      this.$http.post('/index/getDiningMenu',)
        .then(res => {
          if (res.status == 0) {
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
      #newsCanvas {
        
      }
      .el-pagination {
        margin: 0 auto;
        left: 0;
        right: 0;
        margin-bottom:20px;
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
