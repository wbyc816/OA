<template>
    <div>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <subject class='doc-section'></subject>
          <name-card-info class='doc-section'></name-card-info>
          <quantity class='doc-section'></quantity>
          <description  class='doc-section' note='true'></description>
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
    import NameCardInfo from './component/nameCard.component.vue'
    import Description from './component/description.component.vue'
    import Quantity from './component/quantity.component.vue'
    export default{
        data(){
            return{
                docTitle:'Business Card Request Form',
                noteText:`

                `
            }
        },
        components:{
            Subject,NameCardInfo,Description,Quantity,
        }
    }
</script>
