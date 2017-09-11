<template>
    <div>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <job-info class='doc-section'></job-info>
          <description  class='doc-section'></description>
          <div class='doc-form-submit_btn'>
            <el-button type="primary" >Submit</el-button>
          </div>

        </div>
      </el-card>
    </div>
</template>
<style scoped lang='scss'>

</style>
<script>
    import JobInfo from './job-info.component.vue'
    import Description from './description.component.vue'
    export default{
        data(){
            return{
                docTitle:'Job Request & Problem',
            }
        },
        components:{
          JobInfo,Description,
        },
        method:{
          submitForm:function(formDate){
            console.log(formDate);
          }
        }
    }
</script>
