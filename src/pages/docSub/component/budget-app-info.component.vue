<template>
    <div>
      <h4 class='doc-form_title'><slot></slot></h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
        <el-form-item  class='form-box' label="Subject" prop='appInfo'>
          <el-col :span='18'>
            <el-input v-model="ruleForm.appInfo" class='search' >
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Contact No." prop="contactNum">
              <el-col :span='20'>
                <el-input v-model="ruleForm.contactNum">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item   class='form-box' label="Email" prop='email'>
              <el-col :span='20'>
                <el-input v-model="ruleForm.email"  >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
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
                      appInfo: '',
                      contactNum: '',
                      email: '',
                },
                rules:{
                    appInfo:[
                      { required: true, message: '请输入appInfot', trigger: 'blur' },
                    ],
                    contactNum:[
                      { required: true, message: '请输入contactNum', trigger: 'blur' }
                    ],
                    email:[
                      { required: true, message: '请选择一个email', trigger: 'blur' }
                    ],
                },
            }
        },
        components:{

        }
    }
</script>
