<template>
    <div>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <subject class='doc-section'></subject>
          <pre-so class='doc-section'></pre-so>
          <contract-budget class='doc-section'></contract-budget>
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
    import PreSo from './component/pre-so.component.vue'
    import ContractBudget from './component/contract-budget-info.component.vue'
    import Description from './component/description.component.vue'
    export default{
        data(){
            return{
                docTitle:'Contract Approval'
            }
        },
        components:{
            Subject,Description,PreSo,ContractBudget,
        }
    }
</script>
