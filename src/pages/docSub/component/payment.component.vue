<template>
    <div>
      <h4 class='doc-form_title'>Payment</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

        <el-form-item  class='form-box' label="Purpose Of Travel">
          <el-col :span='18'>
            <el-select class='payment-sel' v-model="ruleForm.value" placeholder="">
              <el-option v-for="item in payment" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col >
          <el-col :span='1' class='give-up-pay'>Waive</el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="">
          <el-col :span='18'>
            <el-radio-group v-model="ruleForm.cost"  class="myRadio">
              <el-radio-button label="Normal">Fare<i></i></el-radio-button>
              <el-radio-button label="Secret">Taxes & Charges<i></i></el-radio-button>
              <el-radio-button label="Top Secret">Administrative Charges<i></i></el-radio-button>
            </el-radio-group>
          </el-col >
        </el-form-item>

      </el-form>
    </div>
</template>
<style scoped lang='scss'>
  .payment-sel{
    width:100%;
  }
  .give-up-pay{
    padding-left:10px;
    font-size: 16px;
    line-height: 46px;
    color: #393939;
  }
</style>
<script>
    export default{
        data(){
            return{
                ruleForm: {
                    value: '',
                    cost: '',
                },
                rules:{
                    value:[
                      { required: true, message: '请输入Recipient', trigger: 'blur' },

                    ],
                },
                payment:[{
                  value: '选项1',
                  label: 'Cash',
                }, {
                  value: '选项2',
                  label: 'Cheque',
                },{
                  value: '选项3',
                  label: 'Credit Card',
                },{
                  value: '选项4',
                  label: 'EPS',
                },{
                  value: '选项4',
                  label: 'Other',
                },],
            }
        },
        components:{

        }
    }
</script>
