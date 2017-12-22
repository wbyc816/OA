<template>
  <div class="pdf clearfix" ref="pdfBox">
    <canvas v-for="num in total" :ref="'page'+num"></canvas>
  </div>
</template>
<script>
// import pdfjsLib from 'pdfjs-dist'
import PDFJS from 'pdfjs-dist/webpack.js'
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
      // console.log(PDFJS)
      // pdfjsLib.PDFJS.workerSrc = PDFJS;
      var loadingTask = PDFJS.getDocument(this.src);
      var that = this;
      loadingTask.promise.then((pdfDoc_) => {
        this.pdfDoc = pdfDoc_;
        this.total = pdfDoc_.numPages;
        this.$nextTick(()=>{
          for(var i=1;i<=this.total;i++)
          this.renderPage(i);
        })
        this.$emit('numPages', this.total);       
      }).catch((reason)=> {
        this.$emit('error', reason)
      });
    },
    renderPage(num) {
      this.pdfDoc.getPage(num).then((page) => {
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
  }
}

</style>
