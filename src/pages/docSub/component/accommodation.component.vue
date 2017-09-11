<template>
    <div id='acommodation'>
      <h4 class='doc-form_title'>Acommodation</h4>
      <el-form  label-position="left" :model="ruleForm"  ref="ruleForm" label-width="128px">
        <el-form-item  class='form-box' label="Confidentiality">
          <el-col :lg='6' :md='7' :span="8">
            <el-radio-group v-model="ruleForm.acommodation"  class="myRadio acom-btn">
              <el-radio-button label="Yes">Yes<i></i></el-radio-button>
              <el-radio-button label="No">No<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span='6' >
            <span class='bookHotel' @click="bookHotel()">Booking Hotel</span>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
</template>
<style scoped lang='scss'>
    #acommodation .bookHotel{
      color:#7C5598;
      line-height: 46px;
      cursor: pointer;
    }
</style>
<script>
    export default{
        data(){
            return{
              ruleForm:{
                acommodation: '',
              }
            }
        },
        components:{

        },
        methods:{
            bookHotel:function(){
                console.log("跳转链接");
            }
        },
    }
</script>
