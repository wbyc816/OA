<template>
    <div>
      <h4 class='doc-form_title'>Subject Information</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

        <el-form-item  class='form-box' label="Job Title" prop="jobTitle">
          <el-col :span='18'>
            <el-input v-model="ruleForm.jobTitle">
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Job Categories" prop="jobCate">
          <el-col :span='18'>
            <el-select v-model="ruleForm.problemType" class='job-select'>
              <el-option v-for="item in prbOp" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Urgency">
          <el-col :span='18'>
            <el-radio-group v-model="ruleForm.urgency"  class="myRadio">
              <el-radio-button label="Normal">Normal<i></i></el-radio-button>
              <el-radio-button label="Secret">Secret<i></i></el-radio-button>
              <el-radio-button label="Top Secret">Top Secret<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='12'>
            <el-form-item  class='form-box' label="Staff Name" prop="staffName">
              <el-col :span='21'>
                <el-input v-model="ruleForm.staffName" class='search'>
                  <el-button slot="append">Select</el-button>
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item  class='form-box' label="Tel No." prop="telNum" label-width="80px">
              <el-col :span='20'>
                <el-input v-model="ruleForm.telNum">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item  class='form-box' label="Email Address" prop="email">
          <el-col :span='18'>
            <el-input v-model="ruleForm.email">
            </el-input>
          </el-col>
        </el-form-item>



      </el-form>
    </div>
</template>
<style scoped lang='scss'>
.job-select{
  width:100%;
}
</style>
<script>
    export default{
        data(){
            return{
                ruleForm: {
                      jobTitle: '',
                      jobCate: '',
                      problemType:'',
                      urgency:'',
                      staffName:'',
                      telNum:'',
                      email:'',
                },
                rules:{
                    jobTitle:[
                      { required: true, message: '请输入Job Title', trigger: 'blur' },
                    ],
                    jobCate:[
                      { required: true, message: '请输入Job Categories', trigger: 'blur' },
                    ],
                    staffName:[
                      { required: true, message: '请输入Staff Name', trigger: 'blur' },
                    ],
                },
                prbOp:[{
                        label:'HardWare Problem',
                        value:'1',
                    },
                    {
                        label:'E-library Problem',
                        value:'2',
                    },
                    {
                        label:'Internet Problem',
                        value:'3',
                    },
                    {
                        label:'Old VPN & Mail Box Problem',
                        value:'4',
                     },
                     {
                        label:'Other',
                        value:'5',
                     },]
            }
        },
        components:{

        }
    }
</script>
