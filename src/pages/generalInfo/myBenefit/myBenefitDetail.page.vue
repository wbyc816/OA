<template>
  <div id='myBenefitDetail'>
    <el-card class="formDown">
      <el-row :gutter="30">
        <el-col :span='7'>
          <img src="../../../assets/images/brand1.png">
        </el-col >
        <el-col class="formInfo" :span='11'>
          <p>Ticket Refund Application Form</p>
          <p>Discount/free services, facilities, f&b may ONLY applicable for air crew duty travel. pls ask hotel.</p>
          <div>
            <p>Validity: Never Expires<span class="flRight">2017-01-18</span></p>
          </div>
        </el-col>
        <el-col :span='4'>
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
        <el-card class="showBox">
          <div class="commentBox">
            <img src="../../../assets/images/Image198.png">
            <el-input type="textarea" placeholder="Any Comment?"></el-input>
            <el-checkbox v-model="checked">Share to SO Weibo</el-checkbox>
            <div class="submitBox">
              <i class="iconfont icon-smile"></i>
              <el-button type="primary">Submit</el-button>
            </div>
          </div>
          <weibo :weibo='weibo'></weibo>
        </el-card>
      </el-col>
      <el-col :span='6' >
        <ul class="sideBox">
          <li v-for="o in 4">
            <p>Staff Upsell to Business Class</p>
            <div class="bottom">
              <p>Validity: Never Expires<span class="flRight">Date：2016-12-22</span></p>
            </div>

          </li>
        </ul>
      </el-col>
    </el-row>
    
  </div>
</template>
<style lang='scss'>
  $purple: #7C5598;
  #myBenefitDetail{
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
      padding:20px 35px 20px 20px;
      box-shadow: none;
      .el-row{
        .el-col:first-child{
          text-align:center;
          img{
            max-width:100%;
          }
        }
        .formInfo{
          position: relative;
          height: 126px;
          padding-left: 30px;
          &>p:first-child{
            color:$purple;
            font-size: 18px;
            margin-bottom: 5px;
          }
          &>p:nth-child(2){
            font-size: 15px;
          }
          &>div{
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding-right: 40px
            p{
              color:#676767;
              font-size: 15px;
              line-height: 20px;
            }
            p:first-child{
              color:$purple;
              i{
                margin-right:3px;
              }
            }
            p:last-child{            
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
    .showBox{
      padding:0;
      box-shadow: none;
      height: 400px;
      .commentBox{
        height: 220px;
        box-sizing: border-box;
        padding:25px 20px 25px 80px;
        border-bottom: 2px dashed #f2f2f2;
        position: relative;
        &>img{
          position: absolute;
          top: 25px;
          left: 20px;
          width: 47px;
        }
        .el-textarea{
          height: 100%;
          width: 78%;
          textarea{
            height: 100%;
            background: #F2F2F2;
            font-size: 15px;
            padding: 10px 15px;
            border: none;
            border-radius: 2px;
          }
        }
        .el-checkbox{
          float: right;
          padding-right: 10px;
          .el-checkbox__inner{
            border-radius:0;
            border-color: $purple;
            box-shadow: 0px 0px 1px 1px rgb(223, 209, 229);
          }
          .el-checkbox__label{
            font-size: 15px;
            color:#676767;
          }
        }
        .submitBox{
          position: absolute;
          bottom: 25px;
          right: 20px;
          height: 38px;
          width: 158px;
          i{
            font-size: 30px;
            line-height: 38px;
            color:$purple;
          }
          button{
            height: 100%;
            width: 117px;
            float: right;
          }
        }
      }
      .weibo{
        padding-top:10px;
        padding-right: 20px;
      }
    }
    .sideBox{
      padding:0 8px;
      background: #fff;
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
            i{
              margin-right:3px;
            }
          }
        }
      }
      li:last-child{
        border-bottom: none;
      }
    }
  } 
</style>
<script>
  import Weibo from'../../../components/weibo'
  import pdf from '../../../assets/pdf/test.pdf'
  import pdfjsLib from 'pdfjs-dist'
  export default{
    data(){
      return{
        checked:false,
        weibo:{'author':'HR Group',
        'text':'公司的進步實在有賴每位員工的寶貴意見，而CONNECT就是其中一個直達公司管理層的有效渠道。在跟進期間，您的身份將會被保密。 您可將意見寫信至connect@hkairlines.com。一經刊登，您將有機會獲得價值港幣500元的超市禮券。',
        
        'time':'1213213233'},
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
      Weibo
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
