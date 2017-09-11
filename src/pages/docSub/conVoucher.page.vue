<template>
    <div>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <subject class='doc-section'></subject>
          <app-info class='doc-section'></app-info>
          <payment class='doc-section'></payment>
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
    import AppInfo from './component/con-application-info.component.vue'
    import Payment from './component/payment.component.vue'

    export default{
        data(){
            return{
                docTitle:'Concession Voucher Form',

            }
        },
        components:{
            Subject,Description,AppInfo,Payment,
        }
    }
</script>
