<template>
    <div>
      <h4 class='doc-form_title'>Handset Purchases</h4>
      <el-form label-position="left" :model="ruleForm"  ref="ruleForm" label-width="128px">
        <el-row>
          <el-col :span='10'>
            <el-form-item  label="Mobile Brand Mobile No.">
              <el-col :span='21'>
                <el-input v-model="ruleForm.mobileBrand"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item  label="Amount" >
              <el-col :span='20'>
                <el-input v-model="ruleForm.amount"></el-input>
              </el-col>
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item  label="Purpose" >
          <el-col :span='18'>
            <el-input v-model="ruleForm.purpose"></el-input>
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
               ruleForm: {
                    mobileBrand:'',
                    amount:'',
                    purpose:'',
                  },
            }
        },
        components:{

        }
    }
</script>
