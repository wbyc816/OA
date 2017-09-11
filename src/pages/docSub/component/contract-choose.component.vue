<template>
    <div>
      <h4 class='doc-form_title'>Subject Information</h4>
      <el-form label-position="left" label-width="128px">

        <el-form-item v-for='item in contractDate'  class='form-box' :label="item.label" >
          <el-col :span='18' :v-text='item.content'></el-col>
        </el-form-item>

        <el-button class='choose-btn'>Choose</el-button>

      </el-form>
    </div>
</template>
<style scoped lang='scss'>
    .choose-btn{
      height: 46px;
      width:200px;
      margin-bottom:27px;
      font-size: 16px;
      border-color: #7C5598;
      border-radius: 3px;
      color: #7C5598;

    }
</style>
<script>
    export default{
        data(){
            return{
                contractDate:[
                    {label:'Contract Name',content:'contractInfo.name'},
                    {label:'CCN',content:'contractInfo.cnn'},
                    {label:'Pre-SO Code',content:'contractInfo.preNum'},
                    {label:'Pre-SO Name',content:'contractInfo.preName'},
                ],
                contractInfo:{
                     name:'',
                     cnn:'',
                     preNum:'',
                     preName:'',
                }
            }
        },
        components:{

        }
    }
</script>
