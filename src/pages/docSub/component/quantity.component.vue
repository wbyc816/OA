<template>
    <div>
      <h4 class='doc-form_title'>Quantity</h4>
      <el-form label-position="left" :model="ruleForm"  ref="ruleForm" label-width="128px">
        <el-form-item  class='form-box' label="No. of Box (100 psc each)">
          <el-col :span='18' >
            <el-input v-model="ruleForm.quantity">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
</template>
<style scoped lang='scss'>

</style>
<script>
    export default{
        data(){
            return{
              ruleForm:{
                quantity:'',
              },
            }
        },
        components:{

        }
    }
</script>
