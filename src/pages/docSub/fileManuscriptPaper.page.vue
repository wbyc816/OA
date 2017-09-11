<template>
  <div id='manuscript'>
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitile'></span>
      </div>
      <div>
        <subject class='doc-section'></subject>
        <report class='doc-section'></report>
        <description class='doc-section'></description>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" >Submit</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style lang='scss'>
  #manuscript .doc_title{
    font-size: 18px;
    line-height: 40px;
    border-bottom:1px solid #d5dadf;
    margin-top:-13px;
  }
  #manuscript  .section{
    border-bottom:1px dashed #D5DADF;
    margin-bottom:10px;
  }
  #manuscript  .section:last-child{
    border-bottom:none;
  }
  #manuscript .doc-form_title{
    position: relative;
    font-size: 18px;
    padding-bottom:27px;
    line-height: 20px;
    color: #7C4598;
    text-indent: 9px;
  }
  #manuscript .doc-form_title:before{
    content: '';
    display: block;
    position: absolute;
    left:0;
    top:2.5px;
    width:4px;
    height:15px;
    background-color: #7C4598;
  }
  #manuscript .form-box{
    margin-bottom:27px;
  }
  #manuscript .form-box .el-col{
    height:46px;
  }
  #manuscript .form-submit_btn button{
    height:46px;
    width:250px;
    font-size: 16px;
    border-radius: 3px;
    background-color: #7C5598;
  }
  #manuscript .el-table{
    width:100%;
    margin-bottom:27px;
  }
  #manuscript .el-table .cell{
    display: block;
    text-align: center;
    padding:4px 10px;
    word-wrap:break-word;
  }
</style>
<script>

    import Subject from './component/subject.component.vue'
    import Report from './component/report.component.vue'
    import Description from './component/description.component.vue'

    export default{
        data(){
            return{
                docTitile:'File Manuscript Paper',
            }
        },
        components:{
            Subject,
            Report,
            Description,
        }
    }
</script>
