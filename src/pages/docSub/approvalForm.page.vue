<template>
    <div id='approval'>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <subject class='doc-section'></subject>
          <description  class='doc-section'></description>
          <div class='doc-form-submit_btn'>
            <el-button type="primary" >提交</el-button>
          </div>
        </div>
      </el-card>
    </div>
</template>
<style lang='scss'>

</style>
<script>
    import Subject from './component/subject.component.vue'
    import Description from './component/description.component.vue'
    export default{
        data(){
            return{
                docTitle:'呈批单',

            }
        },
        components:{
          Subject,Description,
        },
        method:{
          submitForm:function(formDate){
            console.log(formDate);
          }
        }
    }
</script>
