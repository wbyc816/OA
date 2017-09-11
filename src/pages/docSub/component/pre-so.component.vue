<template>
    <div>
      <h4 class='doc-form_title'>Subject Information</h4>
      <el-form label-position="left" :model="ruleForm"  ref="ruleForm" label-width="128px">
        <el-form-item  class='form-box' label="Confidentiality">
          <el-col :span='18'>
            <el-radio-group v-model="ruleForm.handleRadio"  class="myRadio">
              <el-radio-button label="New">New<i></i></el-radio-button>
              <el-radio-button label="Change">Change<i></i></el-radio-button>
              <el-radio-button label="Terminate">Terminate<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='19' class='passenger-add'>
            Add
            <i class='iconfont icon-6' @click="handleAdd()"></i>
          </el-col>
          <el-col :span='19'>
            <el-table border :data="tableDatas" border >
              <el-table-column v-for='item in passengerInfo' :prop="item.prop" :label="item.label" v-bind:resizable="false">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

      </el-form>
    </div>
</template>
<style scoped lang='scss'>
  .passenger-add{
    font-size: 14px;
    line-height: 46px;
    text-align: right;
    color: #393939;
  }
  .iconfont{
    color: #7C5598;
  }
  .icon-6{
    font-size: 18px;
    line-height: 46px;
    vertical-align: middle;
  }
</style>
<script>
    export default{
        data(){
            return{
                ruleForm:{
                  handleRadio:''
                },
                rule:[{}],
                passengerInfo:[
                  {"prop":"preCode","label":"Pre-SO Code"},
                  {"prop":"preName","label":"Pre-So Name"},
                  {"prop":"risk","label":"Risk assessment"},
                  {"prop":"handle","label":""},
                ],
                tableDatas: [{
                    preCode: '',
                    preName: '',
                    risk: '',
                    handle:''
                },],
            }
        },
        components:{

        },
        methods:{
          handleAdd:function(){
            console.log("跳出弹窗");
          }
        }
    }
</script>
