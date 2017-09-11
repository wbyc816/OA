<template>
  <div id='business-trip'>
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitle'></span>
      </div>
      <div>
        <subject class='doc-section'></subject>
        <h4 class='doc-form_title'>&nbsp;</h4>
        <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
          <el-row>
            <el-col :span='10'>
              <el-form-item  class='form-box' label="Applicant" prop="application">
                <el-col :span='21' >
                  <el-input v-model="ruleForm.application">
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span='10'>
              <el-form-item  class='form-box paddingLeft' label="Position" label-width="110px">
                <el-col :span='20' >
                  <el-input v-model="ruleForm.position">
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item  class='form-box' label="Mobile No." prop="phone">
            <el-col :span='4' >
              <el-input v-model="ruleForm.phoneFirst">
              </el-input>
            </el-col>
            <el-col :span='2' class='inputs-dash'>—</el-col>
            <el-col :span='12'>
              <el-input v-model="ruleForm.phoneLast">
              </el-input>
            </el-col>
          </el-form-item>

          <el-form-item  class='form-box' label="Business Trip Purpose" prop='purpose'>
            <el-col :span='18' >
              <el-input v-model="ruleForm.purpose">
              </el-input>
            </el-col>
          </el-form-item>

          <el-row>
            <el-col :span='10'>
              <el-form-item  class='form-box' label="Destination" prop="des">
                <el-col :span='21' >
                  <el-input v-model="ruleForm.des">
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span='10'>
              <el-form-item  class='form-box' label="Travel Date" prop='travelDate' label-width="110px" required>
                <el-col :span='20' >
                  <el-input v-model="ruleForm.travelDate">
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item  class='form-box' label="Confidentiality">
            <el-col :span='18'>
              <el-radio-group v-model="ruleForm.confidentiality"  class="myRadio">
                <el-radio-button label="Myself">Yes,By Myself<i></i></el-radio-button>
                <el-radio-button label="Staff Travel">Yes,By Staff Travel<i></i></el-radio-button>
                <el-radio-button label="No">No<i></i></el-radio-button>
              </el-radio-group>
            </el-col>
          </el-form-item>

        </el-form>

        <transport class='doc-section'></transport>
        <accommodate class='doc-section'></accommodate>
        <cashAdvance class='doc-section'></cashAdvance>
        <budgetInfo class='doc-section'></budgetInfo>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" >Submit</el-button>
        </div>
      </div>
    </el-card>

  </div>
</template>
<style lang='scss'>
  #business-trip {
    .paddingLeft{
      .el-form-item__label{
        padding-left: 30px;
      }
      
    }
    .inputs-dash{
      text-align: center;
      color: #95989A;
      line-height: 46px;

    }
  }
  
</style>
<script>
  import Subject from './component/subject.component.vue'
  import Transport from './component/trans.component.vue'
  import Accommodate from './component/accommodation.component.vue'
  import CashAdvance from './component/cash-advance.component.vue'
  import BudgetInfo from './component/business-budget-info.component.vue'

  export default{
    data(){
      return{
        docTitle:'Business Trip',
        ruleForm: {
          application: '',
          phoneFirst: '',
          phoneLast: '',
          purpose: '',
          travelDate:'',
          confidentiality:''
        },
        rules:{
          application:[
          { required: true, message: '请输入申请人', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 1 到 100 个字符之间', trigger: 'change' },
          ],
          phone:[
          { required: true, message: '	(852/86 ...)    请输入你的手机号来接收出票成功短信', trigger: 'change' },
          { type: 'number', message: '号码必须为数字值',trigger: 'change'},
          ],
          purpose:[
          { required: true, message: '输入错误', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 1 到 50 个字符之间', trigger: 'change' },
          ],
          des:[
          { required: true, message: '选择错误', trigger: 'change' }
          ],
          travelDate:[
          { required: true, message: '选择错误', trigger: 'change' }
          ],

        },
      }
    },
    components:{
      Subject,
      Transport,
      Accommodate,
      CashAdvance,
      BudgetInfo,
    }
  }
</script>
