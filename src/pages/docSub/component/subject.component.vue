<template>
  <div>
    <h4 class='doc-form_title'>Subject Information</h4>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

      <el-form-item  class='form-box' label="Recipient" prop="rec">
        <el-col :span='18' >
          <el-input class="search"  v-model="ruleForm.rec">
            <el-button slot="append" @click='selectPerson'>Select</el-button>
          </el-input>
        </el-col>
        <el-col :span='1'><i class='iconfont icon-user1'></i></el-col>
      </el-form-item>

      <el-form-item  class='form-box' label="Subject" prop="sub">
        <el-col :span='18'>
          <el-input v-model="ruleForm.sub">
          </el-input>
        </el-col>
      </el-form-item>

      <el-form-item  class='form-box' label="Confidentiality">
        <el-col :span='18'>
          <el-radio-group v-model="ruleForm.Confidentiality" class="myRadio">
            <el-radio-button label="Normal">Normal<i></i></el-radio-button>
            <el-radio-button label="Secret">Secret<i></i></el-radio-button>
            <el-radio-button label="Top Secret">Top Secret<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-form-item>

      <el-form-item  class='form-box' label="Urgency">
        <el-col :span='18'>
          <el-radio-group v-model="ruleForm.urgency"  class="myRadio">
            <el-radio-button label="Normal">Normal<i></i></el-radio-button>
            <el-radio-button label="Secret">Secret<i></i></el-radio-button>
            <el-radio-button label="Top Secret">Top Secret<i></i></el-radio-button>
          </el-radio-group>
            <i class='iconfont icon-shizhong'></i>

        </el-col>

      </el-form-item>


    </el-form>
  </div>
</template>
<style scoped lang='scss'>
  .icon-user1{
    padding-left:15px;
    font-size: 22px;
    line-height: 46px;
    text-align: center;
    color: #7c5598;
  }
  .icon-shizhong{
    display: inline-block;
    height:46px;
    font-size: 22px;
    line-height: 46px;
    text-align: center;
    color: #7c5598;
    vertical-align: top;
  }
</style>
<script>
    export default{
        data(){
            return{
                radioConf:'Normal',
                radioUrg:'Normal',
                ruleForm: {
                      rec: '',
                      sub: '',
                      confident: '',
                      urgency: '',
                      Confidentiality:'',
                },
                rules:{
                    rec:[
                      { required: true, message: '请输入Recipient', trigger: 'blur' },

                    ],
                    sub:[
                      { required: true, message: '请输入Subject', trigger: 'blur' },
                      { min: 2, max: 5, message: '长度在 1 到 100 个字符之间', trigger: 'change' }
                    ],
                },

            }
        },
        methods:{
          selectPerson:function(){
             alert('弹出职员选择框');
          }
        }
    }
</script>
