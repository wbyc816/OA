<template>
    <div id='corporate'>
      <h4 class='doc-form_title'>Corporate Mobile Phone Plan Application</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

        <el-form-item  class='form-box' label="Propose" prop="propose">
          <el-col :span='18'>
            <el-input  v-model="ruleForm.propose" class='search'>
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item  label="Description" prop="des"  class="textarea">
          <el-col :span='18'>
            <el-input type="textarea" resize='none' v-model="ruleForm.des"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item  label="Mobile Phone No.">
          <el-col :span='18'>
            <el-input  v-model="ruleForm.mobPhone" placeholder=''></el-input>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='10'>
            <el-form-item  label="Service Plan Feature">
              <el-col :span='21'>
                <el-select v-model="ruleForm.serPlan" placeholder="">
                  <el-option v-for="item in serPlanOp" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item  label="Service Required">
              <el-col :span='20'>
                <el-select v-model="ruleForm.serReq" placeholder="">
                  <el-option v-for="item in serReqOp" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
    </div>
</template>
<style lang='scss'>
  #corporate .textarea{
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
                ruleForm: {
                    propose:'',
                    des:'',
                    mobPhone:'',
                    serPlan:'',
                    serReq:'',
                },
                rules:{
                  propose:[
                    { required: true, message: '请输入目的', trigger: 'blur'}
                  ],
                  des:[
                    { required: true, message: '请输入描述', trigger: 'blur'}
                  ],
                  mobPhone:[
                    { required: true, message: '请输入路径', trigger: 'blur'}
                  ],
                },
                serPlanOp: [{
                  value: '选项1',
                  label: '1000-2000分钟'
                },{
                  value: '选项2',
                  label: '500-1000分钟'
                },{
                  value: '选项3',
                  label: '小于500分钟'
                },{
                  value: '选项4',
                  label: '其他'
                }],

                serReqOp:[{
                  value: '选项1',
                  label: '其他'
                },{
                  value: '选项2',
                  label: '国际直播'
                },{
                  value: '选项3',
                  label: '漫游'
                }],
            }
        },
        components:{

        }
    }
</script>
