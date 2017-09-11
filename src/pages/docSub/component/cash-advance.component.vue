<template>
    <div>
      <h4 class='doc-form_title'>Cash Advance</h4>
      <el-form  label-position="left" :model="ruleForm"  ref="ruleForm" label-width="128px">
        <el-form-item  class='form-box' label="Confidentiality">
          <el-col  :lg='6' :md='7' :span="8">
            <el-radio-group v-model="ruleForm.cashAdvance"  class="myRadio">
              <el-radio-button label="Yes">Yes<i></i></el-radio-button>
              <el-radio-button label="No">No<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
          <template v-if='ruleForm.cashAdvance==="Yes"'>
            <el-col :span='6'>
              <el-input></el-input>
            </el-col>
            <el-col :span='4' class='selectMoney'>
              <el-select v-model="ruleForm.money" placeholder=" ">
                <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </template>
        </el-form-item>
      </el-form>
    </div>
</template>
<style scoped lang='scss'>
  .selectMoney{
    padding-left:10px;
  }
</style>
<script>
    export default{
        data(){
            return{
                ruleForm:{
                    cashAdvance:'',
                    money:'',
                },
                options:[
                    {
                      value: '选项1',
                      label: '港币'
                    }, {
                      value: '选项2',
                      label: '人民币'
                    }, {
                      value: '选项3',
                      label: '美元'
                    },
                ],
            }
        },
        components:{

        }
    }
</script>
