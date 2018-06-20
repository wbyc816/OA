<template>
  <div class="pdf clearfix" ref="pdfBox">
    <canvas v-for="num in total" :ref="'page'+num"></canvas>
  </div>
</template>
<script>
// import pdfjsLib from 'pdfjs-dist'
import PDFJS from 'pdfjs-dist/build/pdf.js'
// import pdfworker from 'pdfjs-dist/build/pdf.worker.js'
// import PDFJS from 'pdfjs-dist'
export default {
  props: {
    src: {
      type: [String, Object],
      default: '',
    }
  },
  data() {
    return {
      pafParam: {
        pageNum: 1,
        pageRendering: false,
        total: 0
      },
      total: 0,
      pdfDoc: null,
      boxWidth:800,
    }
  },
  destroyed(){
    this.pdfDoc=null;
    this.total=0;
  },
  mounted() {
    this.boxWidth=this.$refs.pdfBox.clientWidth;
    this.initPdf();
  },
  methods: {
    initPdf() {
      PDFJS.PDFJS.cMapUrl = '../../static/cmaps/';
      // PDFJS.PDFJS.cMapUrl = 'cmaps/';
      PDFJS.PDFJS.cMapPacked = true;
      PDFJS.PDFJS.disableWorker = true;
      var loadingTask = PDFJS.getDocument(this.src);
      var that = this;
      loadingTask.promise.then((pdfDoc_) => {
        this.pdfDoc = pdfDoc_;
        this.total = pdfDoc_.numPages;
        this.$nextTick(()=>{
          console.log(this.total)
          var max=this.total>200?200:this.total;
          for(var i=1;i<=max;i++){
            this.renderPage(i);
          }
        })
        if(this.total>200){
          this.$emit('numPages', 200);     
          this.$emit('moreNum', true);     
        }else{
          this.$emit('moreNum', false);
          this.$emit('numPages', 200);     
        }
      }).catch((reason)=> {
        this.$emit('error', reason)
      });
    },
    renderPage(num) {
      this.pdfDoc.getPage(num).then((page) => {
        // console.log(num)
        var viewport = page.getViewport(this.boxWidth / page.getViewport(1).width);
        var canvas = this.$refs['page' + num][0];
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          if (num === 1) {
            this.$emit('pageLoaded', num);
          }
        });
      });
    }
  }

}

</script>
<style lang='scss' scope>
$purple: #7C5598;
.pdf{
  canvas{
    float:left;
    // border:1px solid red;
  }
}

</style>
