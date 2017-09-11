<template>
    <div>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <subject class='doc-section'></subject>
          <application class='doc-section'><h4>Application Information </h4></application>
          <payment-info class='doc-section'></payment-info>
          <description  class='doc-section'></description>
        </div>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" >Submit</el-button>
        </div>
      </el-card>
    </div>
</template>
<style scoped lang='scss'>

</style>
<script>
    import Subject from './component/subject.component.vue'
    import Application from './component/budget-app-info.component.vue'
    import PaymentInfo from './component/payment-info.component.vue'
    import Description from './component/description.component.vue'

    export default{
        data(){
            return{
                docTitle:'Payment Form'
            }
        },
        components:{
            Subject,
            Application,
            PaymentInfo,
            Description,
        }
    }
</script>
