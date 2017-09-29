<template>
  <div id='preview'>
    <el-card class="formDown">
      <el-row>
        <el-col :span='3'>
          <img src="../assets/images/pdfImg.png">
        </el-col >
        <el-col class="formInfo" :span='18'>
          <ul>
            <li>
              <p>Corporate PPT Template_TC <i class="el-icon-star-on"></i></p>
              <p>Version:DEC_2016 Revision Date：2016-06-15</p>
              <p>Department：COMMERCIAL</p>
              <p>Category：Corporate PPT Template</p>
              <p>Release Date：2016-12-22 Size：1.34M</p>
            </li>
          </ul>          
        </el-col>
        <el-col :span='3'>
          <el-button type="primary">Download</el-button>
        </el-col>

      </el-row>
    </el-card>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <el-card class="pdfBox" >
          <canvas  id="newsCanvas"></canvas>
          <el-pagination
          :current-page="pafParam.pageNum"
          :page-size="1"
          layout="total, prev, pager, next, jumper"
          :total="pafParam.total"
          v-on:current-change="changePage">
        </el-pagination>
      </el-card>
    </el-col>
    <el-col :span='6' >
      <ul class="sideBox">
        <li v-for="o in 4">
          <p>Corporate PPT Template_TCPPPPT Template_TCPPT Template_TC</p>
          <div class="bottom">
            <p>Deadline: 2016-02-19</p>
            <p>Date：2016-12-22</p>
          </div>
        </li>
      </ul>
    </el-col>
  </el-row>
</div>
</template>
<script>
  import pdf from '../assets/pdf/test.pdf'
  import pdfjsLib from 'pdfjs-dist'
  export default{
    data(){
      return{
        checked:false,
        pafParam:{
          pageNum :1,
          pageRendering :false,
          total:0
        },
        pdfDoc:null,
        pageNumPending:null,

      }
      
    },
    components:{
    },
    mounted(){
      this.initPdf();      
    },
    methods:{
      initPdf(){
        pdfjsLib.PDFJS.workerSrc = '../pdf.worker.js';
        var loadingTask = pdfjsLib.getDocument(pdf);
        var that=this;
        loadingTask.promise.then(function (pdfDoc_) {
          that.pdfDoc = pdfDoc_;
          console.log(pdfDoc_);
          that.pafParam.total=pdfDoc_.numPages;

          that.renderPage(that.pafParam.pageNum);
        }).catch(function (reason) {
          console.error('Error: ' + reason);
        });
      },
      renderPage(num) {
        this.pageRendering = true;
        var that=this;
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
       } 
       else{
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
    changePage(newPage){
      console.log(newPage);
      console.log(this.pafParam.pageNum);
      if(newPage-this.pafParam.pageNum==1){
        this.onNextPage();
      }else if(newPage-this.pafParam.pageNum==-1){
        this.onPrevPage();
      }else{
        this.renderPage(newPage);
      }
      this.pafParam.pageNum=newPage;
    }

  }

}

</script>
<style lang='scss'>
  $purple: #7C5598;
  #preview{
    .divider{
      position: relative;
      margin-right: 7px;
      padding-right: 7px;
      &:before{
        content:'';
        display: block;
        position: absolute;
        right: 0;
        top:0;
        bottom: 0;
        margin:auto 0;
        height: 13px;
        border-right: 1px solid #676767;
      }
    }
    .flRight{
      float: right;
    }
    .purple{
      color:$purple;
    }
    .formDown{
      padding:20px 35px;
      box-shadow: none;
      .el-row{
        .el-col:first-child{
          img{
            height:100%;
          }
        }
        .formInfo{
          padding-left: 30px;
          li{
            p:first-child{
              line-height:35px;
              font-size: 16px;
              color:$purple;
              &>i{
                padding-left: 15px;
                color:rgba(355,100,89,.9);
              }
            }
            p:not(:first-child){
              line-height: 20px;
              font-size: 14px;
              color:#676767;
            }
          }
        }
        .el-col:last-child{
          position: absolute;
          right: 0;
          height: 45px;
          margin: auto;
          top: 0;
          bottom: 0;
          button{
            width: 100%;
            height: 100%;
            font-size: 20px;
          }
        }
      }
    }
    .pdfBox{
      padding:0;
      box-shadow: none;
      .el-card__body{
        padding: 0;
        height: 1150px;
        position: relative;
        text-align: center;
        .el-pagination{
          position: absolute;
          margin: 0 auto;
          left: 0;
          right: 0;
          bottom: 10px;
        }
      }
    }
    
    .sideBox{
      padding:0 8px;
      background: #fff;
      min-height: 1150px;
      li{
        position: relative;
        min-height: 100px;
        padding:12px 9px 56px 0;
        border-bottom: 1px solid #f2f2f2;
        box-sizing: border-box;
        &>p:first-child{
          color:$purple;
          font-size: 14px;
        }
        .bottom{
          position:absolute;
          bottom: 6px;
          left: 0;
          width: 100%;

          p{
            color:#676767;
            padding-right: 9px;
            font-size: 12px;
            line-height: 20px;
          }
          p:first-child{
            color:#E50012;
          }
        }
      }
      li:last-child{
        border-bottom: none;
      }
    }
  } 
</style>

