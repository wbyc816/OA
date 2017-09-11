<template>
    <div>
      <h4 class='doc-form_title'>Report information</h4>
      <el-form  label-position="left" :model="ruleForm" ref="ruleForm" label-width="128px">
        <el-form-item   class='form-box' label="To">
          <el-col :span='18'>
            <el-input  v-model="ruleForm.to">
            </el-input>
          </el-col>
          <el-col :span='2'>
            <i :class="arrowDir" class='arrow'@click="hideClick()"></i>
          </el-col>
        </el-form-item>

        <el-form-item   class='form-box' label="Report To" v-if='hideReport'>
          <el-col :span='18'>
            <el-input  v-model="ruleForm.report">
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item   class='form-box' label="Copy To" v-if='hideReport'>
          <el-col :span='18'>
            <el-input v-model="ruleForm.copy">
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item   class='form-box' label="Proposer">
          <el-col :span='18'>
            <el-input class="search"  v-model="ruleForm.propose">
              <el-button slot="append" @click='selectPerson'>Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
</template>
<style scoped lang='scss'>
  .arrow{
    padding:0 20px;
    line-height: 46px;
    cursor: pointer;
  }
</style>
<script>
    export default{
        data(){
            return{
                hideReport:true,
                ruleForm: {
                    to:'',
                    report:'',
                    copy:'',
                    propose:'',
                  },
            }
        },
        methods: {
          hideClick:function(){
            this.hideReport = !this.hideReport;
          },
          selectPerson:function(){
             alert('弹出职员选择框');
          }
        },
        computed:{
          arrowDir:function(){
            return this.hideReport?"el-icon-arrow-up":"el-icon-arrow-down";
          }
        },
    }
</script>
