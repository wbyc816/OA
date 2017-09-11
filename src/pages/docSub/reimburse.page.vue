<template>
    <div>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <subject class='doc-section'></subject>
          <application class='doc-section'><h4>Reimbursement Staff Info</h4></application>
          <reim-info class='doc-section'></reim-info>
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

    import Subject from './component/subject.component.vue'
    import Application from './component/budget-app-info.component.vue'
    import ReimInfo from './component/reim-info.component.vue'
    import Description from './component/description.component.vue'

    export default{
        data(){
            return{
                docTitle:'Reimbursement Form'
            }
        },
        components:{
            Subject,Description,Application,ReimInfo,
        }
    }
</script>
