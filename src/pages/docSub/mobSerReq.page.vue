<template>
  <div id='mob-ser-req'>
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitile'></span>
      </div>
      <subject class='doc-section'></subject>
      <corporate class='doc-section'></corporate>
      <handset-pur class='doc-section'></handset-pur>
      <description class='doc-section'></description>
      <div class='doc-form-submit_btn'>
        <el-button type="primary" >Submit</el-button>
      </div>
    </el-card>

  </div>
</template>
<style scoped lang='scss'>

</style>
<script>
    import Subject from'./component/subject.component.vue'
    import Corporate from'./component/corporateMob.component.vue'
    import HandsetPur from'./component/handsetPurchases.component.vue'
    import Description from './component/description.component.vue'
    export default{
        data(){
            return{
                docTitile:'Moblie Phone Service Request'
            }
        },
        components:{
            Subject,
            Corporate,
            HandsetPur,
            Description,
        }
    }
</script>
