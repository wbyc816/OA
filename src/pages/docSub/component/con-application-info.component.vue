<template>
    <div id='application'>
      <h4 class='doc-form_title'>Application Information</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
        <el-row>
            <el-col :span='10'>
              <el-form-item  class='form-box' label="Application" prop='application'>
                <el-col :span='21'>
                  <el-input v-model="ruleForm.application" >
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span='10'>
              <el-form-item  class='form-box' label="Company" prop='company'>
                <el-col :span='20'>
                  <el-input  v-model="ruleForm.company">
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

        <el-form-item  class='form-box' label="Purpose Of Travel">
            <el-col :span='18'>
              <el-select class='company-sel' v-model="value" placeholder="">
                <el-option v-for="item in purposeTrl" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

        <el-row>
            <el-col :span='21' class='passenger-add'>
              Add
              <i class='iconfont icon-6' @click="handleAdd()"></i>
            </el-col>
            <el-col :span='21'>
              <el-table border :data="tableDatas" border >
                <el-table-column v-for='item in passengerInfo' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

        <el-form-item class='form-box' label="UGSA CLL">
          <el-col :span='12'>
            <el-radio-group v-model="ruleForm.ugsaRadio"  class="myRadio">
              <el-radio-button label="Yes">Yes<i></i></el-radio-button>
              <el-radio-button label="No">No<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item  label="Remark" prop="remark"  class="textarea">
          <el-col :span='18'>
            <el-input type="textarea" v-bind:resize='none' v-model="ruleForm.remark"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item class='form-box' label="Issuing Office">
          <el-col :span='12'>
            <el-radio-group v-model="ruleForm.issueRadio"  class="myRadio">
              <el-radio-button label="HQ">HQ<i></i></el-radio-button>
              <el-radio-button label="HKO">HKO<i></i></el-radio-button>
              <el-radio-button label="Outport">Outport<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span='6' v-if='ruleForm.issueRadio==="Outport"'>
            <el-input></el-input>
          </el-col>
        </el-form-item>

      </el-form>
    </div>
</template>
<style lang='scss'>
  #application .company-sel{
    width:100%;
  }
  #application .passenger-add{
    font-size: 14px;
    line-height: 46px;
    text-align: right;
    color: #393939;
  }
  #application .icon-6{
    color: #7C5598;
    font-size: 18px;
    line-height: 46px;
    vertical-align: middle;
  }
  #application .textarea{
    height:188px;
    margin-bottom: 27px;
    .el-textarea__inner{
      height:188px;
    }
  }
</style>
<script>
    export default{
        data(){
            return{
                value:'',
                none:'none',
                ruleForm: {
                          application: '',
                          company: '',
                          ugsaRadio:'',
                          remark:'',
                          issueRadio:''
                },
                rules:{
                    application:[
                      { required: true, message: 'application', trigger: 'blur' },
                    ],
                    company:[
                      { required: true, message: 'company', trigger: 'blur' }
                    ],
                    remark:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                },
                purposeTrl:[{
                  value: '选项1',
                  label: '黄金糕'
                }, {
                  value: '选项2',
                  label: '双皮奶'
                },],
                passengerInfo:[
                  {"prop":"passenger","label":"Passenger Name","width":"133"},
                  {"prop":"openTicket","label":"First Name","width":"113"},
                  {"prop":"from","label":"From","width":"60"},
                  {"prop":"to","label":"To","width":"45"},
                  {"prop":"department","label":"Department Date","width":"126"},
                  {"prop":"flightNum","label":"Flight No.","width":"90"},
                  {"prop":"myClass","label":"Class","width":"65"},
                  {"prop":"rebate","label":"ID/AD Rebate","width":"70"},
                  {"prop":"handle","label":"","width":"60"},
                ],
                tableDatas: [{
                    passenger: '',
                    openTicket: '',
                    from: '',
                    to:'',
                    department:'',
                    flightNum:'',
                    myClass:'',
                    rebate:'',
                    handle:'',
                },],
            }
        },
        components:{

        },
        methods:{
          handleAdd:function(){
            alert("弹出选框");
          }
        }
    }
</script>
