<template>
    <div>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <subject class='doc-section'></subject>
          <app-info class='doc-section'></app-info>
          <budget-info class='doc-section'></budget-info>
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
    import Description from './component/description.component.vue'
    import AppInfo from './component/pro-application-info.component.vue'
    import BudgetInfo from './component/pro-budget-info.component.vue'
    export default{
        data(){
            return{
                docTitle:'Procurement Requisition Form'
            }
        },
        components:{
             Subject,Description,AppInfo,BudgetInfo,
        }
    }
</script>
